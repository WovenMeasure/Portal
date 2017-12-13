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
    templateUrl: 'dcr-bank-unmatched-all.html',
    providers: [ConfirmationService]
})
export class DcrBankUnmatchedAllComponent {   
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
        this.contextService.currentSection = "bankreconcileAllBankUnmatched";
        this.load();      
    }       

  

    load() {
        this.colorIncrement = 0;
        this.currentColor = "#EFF0F1";
        var _self = this;

        this.spinnerService.postStatus('Loading...');
        let $observable = this.proxyService.Get("dcrreconcile/allBankUnmatched");
        $observable.subscribe(
            data => {
                if (data.success) {                     
                    _self.matches = data.bankOnly;
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