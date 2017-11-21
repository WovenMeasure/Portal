//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem, Message} from 'primeng/primeng';

@Component({
    templateUrl: 'reports-list.html'
})
export class ReportListComponent {   
    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private ngbModal: NgbModal,
                private translationService: TranslationService) {

    }    
    reports: any[];
    ngOnInit() {
        this.contextService.currentSection = "reports";
        this.reports = new Array();
        this.reports.push(
            {
                name: 'Armored Car Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fArmoredCarReport'
            },
            {
                name: 'Automatic Losses Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fAutomaticLossReport'
            },
            {
                name: 'Change Fund Petty Cash Disbursement Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fChangeFund-PettyCashDisbursement'
            },
            {
                name: 'Credit Card Activity Spike Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fSpikeCreditCardActivityReport'
            },
            {
                name: 'Credit Card Chargeback Disputes',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fCCChargeBackDispute'
            },
            {
                name: 'Credit Card Processor Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fCreditCardProcessor'
            },
            {
                name: 'Disputes Grand Totals Location/Region',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fDisputesGrandTotalslocationRegion'
            },
            {
                name: 'Location Bank Account Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fLocationBankAccounts'
            },
            {
                name: 'Missing Case Number Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fMissingCaseNumberReport'
            },
            {
                name: 'Missing DDA Account No report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fMissingDDAAccountReport'
            },
            {
                name: 'Missing Merchant ID Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fMissingMerchantIDReport'
            },
            {
                name: 'No Credit Card Activity Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fNoCreditCardActivityReport'
            },
            {
                name: 'Refund Report',
                url: 'http://laz-reportviewer.wovenmeasure.com/ReportViewer?reportPath=%2fReport+Project1%2fRefundReport'
            }
        );
    }       
    
}