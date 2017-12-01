//our root app component
import { Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import { LookupService } from '../common/services/lookup-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SelectItem} from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';
import * as _ from 'underscore';

import { TabsModule, ModalModule, TabsetComponent } from 'ngx-bootstrap';

@Component({
    templateUrl: 'location-detail-lite.html',
    providers: [ConfirmationService]
})
export class LocationDetailLiteComponent implements AfterViewInit, OnInit {   
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
    locationId: any;
    location: any;
    transactions: any[];
    disbursements: any[];
    cases: any[];
    loaded: boolean = false;
    ngOnInit() {
        var _self = this;
        this.contextService.currentSection = "acctManagement";
        this.locationId = this.route.snapshot.queryParams['i'];
        _self.loadLocationDetail();        

    }   

    ngAfterViewInit() {
    }   

    loadLocationDetail() {
        var _self = this;
        this.spinnerService.postStatus('Loading Location');
        let $observable = this.proxyService.Get("location/" + this.locationId);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.location = data.location;
                    var at = _.sortBy(this.location.arpLocationAudits, function (t) {
                        return - (new Date(t.changeDate).getTime());
                    });
                    this.location.arpLocationAudits = at;
                    this.transactions = data.transactions;
                    this.cases = data.cases;
                    this.disbursements = data.disbursements;
                    this.loaded = true;
                   
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
}