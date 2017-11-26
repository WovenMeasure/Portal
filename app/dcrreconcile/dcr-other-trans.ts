//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef, Input} from '@angular/core';
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
    templateUrl: 'dcr-other-trans.html',
    providers: [ConfirmationService],
    selector: 'other-transactions'
})
export class DcrReconcilesOtherTransactionsComponent {   
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


    @Input()
    data: any[];

    lockbox: any[];
    bankingAdjustments: any[];
    checksPaid: any[];
    zba: any[];
    otherCredits: any[];
    otherDebits: any[];

    ngOnChanges() {
        this.lockbox = _.filter(this.data, (record) => { return this.constants.baiCodeLockboxCodes.indexOf(record.baiCode) >= 0 });
        this.bankingAdjustments = _.filter(this.data, (record) => { return this.constants.baiCodeBankingAdjustmentCodes.indexOf(record.baiCode) >= 0 });
        this.checksPaid = _.filter(this.data, (record) => { return this.constants.baiCodeChecksPaidCodes.indexOf(record.baiCode) >= 0 });
        this.zba = _.filter(this.data, (record) => { return this.constants.baiCodeZBACodes.indexOf(record.baiCode) >= 0 });
        this.otherCredits = _.filter(this.data, (record) => { return this.constants.baiCodeOtherCreditsCodes.indexOf(record.baiCode) >= 0 });
        this.otherDebits = _.filter(this.data, (record) => { return this.constants.baiCodeOtherDebitsCodes.indexOf(record.baiCode) >= 0 });
    }       


    daysBetween(fd, sd): number {
        let firstDate: Date = new Date(fd);
        let secondDate: Date = new Date(sd);
        let oneDay:number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let diffDays: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        return diffDays;
    }
    
}