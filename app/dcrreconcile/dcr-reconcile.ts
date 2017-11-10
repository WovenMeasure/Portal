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
    filtered: any[];
    loaded: boolean = false;
    filterLocation: string;
    filterMerchantId: string;    
    fromDate: Date;
    toDate: Date;
    type: string;
    type2: string;
    locations: SelectItem[];
    types: any[];

    ngOnInit() {
        this.matches = [];
        this.filterLocation = "";
        this.filterMerchantId = "";
        var date = new Date();
        this.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        this.toDate = date;
        this.contextService.currentSection = "bankreconcile";
        this.type = "1";
        this.type2 = "1";
        this.loadLocations();
        this.types = [
            { label: "Bank Only Unmatched", value: "2" },
            { label: "DCR Only Unmatched", value: "3" },
            { label: "Matches Only", value: "1" },
        ]
        //this.loadReconciles();
    }       

    loadLocations() {
        this.spinnerService.postStatus('Loading Locations');
        let $observable = this.proxyService.Get("location/list/0/7000/true");
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
        this.spinnerService.postStatus('Loading...');
        //type 2 = cash, type 1 = credit card
        let $observable = this.proxyService.Get("dcrreconcile/?location=" + this.filterLocation + "&mid=" + this.filterMerchantId + "&type=" + this.type + "&from=" + moment(this.fromDate).format("MM-DD-YYYY") + "&to=" + moment(this.toDate).format("MM-DD-YYYY"));
        $observable.subscribe(
            data => {
                if (data.success) {
                    _self.matches = data.reconciles;
                    _self.type2 = _self.type;
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

    filter() {
        this.loadReconciles();
    }

    daysBetween(fd, sd): number {
        let firstDate: Date = new Date(fd);
        let secondDate: Date = new Date(sd);
        let oneDay:number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let diffDays: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        return diffDays;
    }
}