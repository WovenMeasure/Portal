﻿//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import { LookupService } from '../common/services/lookup-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem } from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule, DataTable } from 'primeng/primeng';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
    templateUrl: 'dcr-credit-reconcile-list.html',
    providers: [ConfirmationService]
})
export class DcrCreditReconcilesListComponent {   
    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private lookupService: LookupService,
                private ngbModal: NgbModal,
                private translationService: TranslationService,
                private confirmationService: ConfirmationService) {
    }    

    msgs: Message[] = [];    
    matches: any[];
    filtered: any[];
    loaded: boolean = false;
    filterLocation: string;
    filterRegion: string;
    fromDate: Date;
    toDate: Date;
    locations: SelectItem[];
    regions: SelectItem[];
    dcrOnly: any[];
    ccOnly: any[];
    currentCC: any;
    currentMatchVariance: any;
    currentMatchVisaVariance: any;
    currentMatchAmexVariance: any;
    currentMatchChoices: any[];

    ngOnInit() {
        this.matches = [];
        this.dcrOnly = [];
        this.ccOnly = [];
        this.currentMatchChoices = [];
        this.filterLocation = "";
        this.filterRegion = "";
        var date = new Date();
        this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.toDate = date;
        this.contextService.currentSection = "creditreconcile";
        this.loadRegions();
        this.currentCC = null;
    }       

    loadRegions() {
        this.spinnerService.postStatus('Loading Regions');
        let promise = new Promise((resolve, reject) => {
            this.regions = [];
            let observable$ = this.lookupService.loadRegions();
            observable$.subscribe(
                data => {
                    if (data.success) {
                        this.regions.push({ label: 'Select Region', value: null });
                        for (let n: number = 0; n < data.regions.length; n++) {
                            this.regions.push({ label: data.regions[n].regionDesc, value: data.regions[n].strRegionID });
                        }
                        resolve();
                    }
                    else {
                        reject();
                    }
                },
                (err) => {
                    this.msgs.push({ severity: 'error', summary: err });
                },
                () => {
                    this.spinnerService.finishCurrentStatus();
                });
        });
        return promise;
    }

    loadLocations() {
        if (!this.filterRegion)
            return;

        this.spinnerService.postStatus('Loading Locations');
        let $observable = this.proxyService.Get("location/listForRegion/" + this.filterRegion + "/true");
        $observable.subscribe(
            data => {
                if (data.success) {
                    let locs: string[] = _.map(data.locations, (l) => {
                        return { locationID: l.locationID };
                    });
                    
                    this.locations = _.map(locs, (l) => {
                        if (l.locationID.length > 7) { l.locationID = l.locationID.substring(0, 7) };
                        return { label: l.locationID, value: l.locationID };
                    });
                }
                else {
                    this.msgs.push({ severity: 'error', summary: data.errorMessage });
                }
            },
            (err) => {
                this.msgs.push({ severity: 'error', summary: err });
            },
            () => { 
                this.spinnerService.finishCurrentStatus();
            });
    } 

    loadReconciles() {
        var _self = this;
        if (!this.filterLocation) {
            return;
        }

        this.spinnerService.postStatus('Loading...');
        let $observable = this.proxyService.Get("dcrreconcile/credit/?location=" + this.filterLocation + "&from=" + moment(this.fromDate).format("MM-DD-YYYY") + "&to=" + moment(this.toDate).format("MM-DD-YYYY"));
        $observable.subscribe(
            data => {
                if (data.success) {
                    _self.matches = data.reconciles;
                    _self.dcrOnly = data.dcrOnly;
                    _self.ccOnly = data.ccOnly;
                    _self.currentCC = null;
                    _self.currentMatchChoices = [];
                }
                else {
                    _self.msgs.push({ severity: 'error', summary: data.errorMessage });
                }
            },
            (err) => {
                _self.msgs.push({ severity: 'error', summary: err });
            },
            () => {
                _self.spinnerService.finishCurrentStatus();
            });   
    }   

    sumField(fieldName: string): number {
        var values = _(this.matches).pluck(fieldName);
        let sum:number = 0;
        _(values).each(function (value) {
            sum += value;
        });
        return sum;
    }

    sumFieldFromCollection(collection: any[], fieldName: string): number {
        var values = _(collection).pluck(fieldName);
        let sum: number = 0;
        _(values).each(function (value) {
            sum += value;
        });
        return sum;
    }

    filter() {
        this.loadReconciles();
    }    

    getMatchColor(value: number, value2: number) {
        if (value === value2)
            return "inherit";

        return "red";
    }

    dropCC($event: any) {
        this.currentCC = $event.dragData;
        this.currentMatchChoices = [];
        this.calcVariance();
    }

    dropDcr($event: any) {
        this.currentMatchChoices.push($event.dragData);
        this.calcVariance();
    }

    removeDcrMatch(dcr: any) {
        var index = this.currentMatchChoices.indexOf(dcr);
        this.currentMatchChoices.splice(index, 1);
        this.calcVariance();
    }

    notInMatches(dcr: any) {
        var index = this.currentMatchChoices.indexOf(dcr);
        return index === -1;
    }

    resetMatches() {
        this.currentCC = null;
        this.currentMatchChoices = [];
        this.currentMatchVariance = 0.0;
    }

    calcVariance() {
        this.currentMatchVariance = Math.abs(this.currentCC.totalCCIMFCreditAmount) - (Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numMCVisaAmount")) +
            Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numDiscoverAmount")) +
            Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numAmexAmount")));


        this.calcVisaMCVariance();
        this.calcAmexMCVariance();
        //(ProcessedPaidByOthers) - Sum(IsNull(numMCVisaAmount, 0) + IsNull(numDiscoverAmount, 0) + isNull(numAmexAmount, 0)),
    }

    calcVisaMCVariance() {
        this.currentMatchVisaVariance = Math.abs(this.currentCC.ccimfmcVisaDiscAmount) - (Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numMCVisaAmount")) +
            Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numDiscoverAmount")));

        //(ProcessedPaidByOthers) - Sum(IsNull(numMCVisaAmount, 0) + IsNull(numDiscoverAmount, 0) + isNull(numAmexAmount, 0)),
    }

    calcAmexMCVariance() {
        this.currentMatchAmexVariance = Math.abs(this.currentCC.ccimfAmexAmount) - Math.abs(this.sumFieldFromCollection(this.currentMatchChoices, "numAmexAmount"));

        //(ProcessedPaidByOthers) - Sum(IsNull(numMCVisaAmount, 0) + IsNull(numDiscoverAmount, 0) + isNull(numAmexAmount, 0)),
    }

}