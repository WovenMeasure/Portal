//our root app component
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
    templateUrl: 'dcr-reconcile-list.html',
    providers: [ConfirmationService]
})
export class DcrReconcilesListComponent {   
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
    allMatches: any[];
    otherTransactions: any[];
    filtered: any[];
    loaded: boolean = false;
    filterLocation: string;
    filterBankAccount: string;  
    filterRegion: string;
    fromDate: Date;
    toDate: Date;
    type: string;
    type2: string;
    locations: SelectItem[];
    regions: SelectItem[];
    types: any[];
    bankOnlySubTypes: any[];
    bankOnlySubType: any;

    ngOnInit() {
        this.bankOnlySubType = "1";
        this.matches = [];
        this.allMatches = [];
        this.filterLocation = "";
        this.colorIncrement = 0;
        this.filterBankAccount = "";
        this.filterRegion = "";
        var date = new Date();
        this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.toDate = date;
        this.contextService.currentSection = "bankreconcile";
        this.type = "1";
        this.type2 = "1";
        this.loadRegions();
        this.currentColor = "#EFF0F1";
        this.types = [
            { label: "Bank Only Unmatched", value: "2" },
            { label: "DCR Only Unmatched", value: "3" },
            { label: "Matches Only", value: "1" },
            { label: "Other Transactions", value: "4" }
        ];

        this.bankOnlySubTypes = [
            { label: "All", value: "1" },
            { label: "Cash Deposits", value: "2" },
            { label: "ACH Credits", value: "3" },
        ];
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
        this.colorIncrement = 0;
        this.currentColor = "#EFF0F1";
        var _self = this;
        if (!this.filterLocation && !this.filterBankAccount) {
            return;
        }

        this.spinnerService.postStatus('Loading...');

        if (_self.type === "4") {
            let $observable = this.proxyService.Get("dcrreconcile/othertransactions/?location=" + this.filterLocation + "&from=" + moment(this.fromDate).format("MM-DD-YYYY") + "&to=" + moment(this.toDate).format("MM-DD-YYYY"));
            $observable.subscribe(
                data => {
                    if (data.success) {                     
                        _self.otherTransactions = data.otherTransactions;
                        _self.type2 = _self.type;
                    }
                    else {
                        _self.msgs.push({ severity: 'error', summary: data.responseMessage });
                    }
                },
                (err) => {
                    _self.msgs.push({ severity: 'error', summary: err });
                },
                () => {
                    _self.spinnerService.finishCurrentStatus();
                });
        }
        else {
            //type 2 = cash, type 1 = credit card
            let $observable = this.proxyService.Get("dcrreconcile/?location=" + this.filterLocation + "&ban=" + this.filterBankAccount + "&type=" + this.type + "&from=" + moment(this.fromDate).format("MM-DD-YYYY") + "&to=" + moment(this.toDate).format("MM-DD-YYYY"));
            $observable.subscribe(
                data => {
                    if (data.success) {
                        if (_self.type === "1")
                            _self.matches = data.reconciles;
                        else if (_self.type === "2")
                            _self.matches = data.bankOnly;
                        else if (_self.type === "3")
                            _self.matches = data.dcrOnly;

                        _self.type2 = _self.type;
                        this.allMatches = _self.matches;
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
    }   

    filter() {
        this.loadReconciles();
    }


    filterSubType() {
        if (this.bankOnlySubType === "1") {
            this.matches = this.allMatches;
        }
        else if (this.bankOnlySubType === "2") {
            this.matches = _.filter(this.allMatches, (m) => { return m.baiCode === "301" });
        }
        else if (this.bankOnlySubType === "3") {
            this.matches = _.filter(this.allMatches, (m) => { return m.baiCode === "165" });
        }
    }

    daysBetween(fd, sd): number {
        let firstDate: Date = new Date(fd);
        let secondDate: Date = new Date(sd);
        let oneDay:number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let diffDays: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        return diffDays;
    }

    currentColor: string;
    colorIncrement: number;
    rowColor(index): string {
        if (index == 0 || index % 2 == 0) {
            return "#EFF0F1";
        }
        else {
            return "#B3E9FF";
        }
        
    }


    sumField(fieldName: string): number {
        var values = _(this.matches).pluck(fieldName);
        let sum: number = 0;
        _(values).each(function (value) {
            sum += value;
        });
        return sum;
    }
}