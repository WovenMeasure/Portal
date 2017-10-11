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
    reconciles: any[];
    filtered: any[];
    loaded: boolean = false;
    filterLocationName: string;
    filterLocationId: string;
    filterMerchantId: string;    

    ngOnInit() {
        this.contextService.currentSection = "bankreconcile";
        this.loadReconciles();
    }       

    loadReconciles() {
        this.spinnerService.postStatus('Loading...');
        let $observable = this.proxyService.Get("dcrreconcile");
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.reconciles = data.reconciles;
                    this.filtered = data.reconciles;
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

    filter() {
        var _self = this;
        this.filtered = _.filter(this.reconciles, (r) => {
            let match: boolean = true;
            if (_self.filterLocationId) {
                match = r.dcrData.locationNum === _self.filterLocationId
            }

            if (match && _self.filterLocationName) {
                match = r.dcrData.locationDesc === _self.filterLocationName;
            }

            if (match && _self.filterMerchantId) {
                match = r.dcrData.merchantId === _self.filterMerchantId;
            }
            return match;
        });
    }
}