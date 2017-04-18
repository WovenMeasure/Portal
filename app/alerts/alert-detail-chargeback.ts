﻿import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import { LookupService } from '../common/services/lookup-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import {AlertService } from "./alert-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SelectItem} from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule, EditorModule, SharedModule} from 'primeng/primeng';

@Component({
    templateUrl: 'alert-detail-chargeback.html',
    providers: [ConfirmationService]
})
export class AlertDetailChargeBackComponent {    
    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private alertService: AlertService,
                private lookupService: LookupService,
                private ngbModal: NgbModal,
                private translationService: TranslationService,
                private confirmationService: ConfirmationService) {
    }    

    msgs: Message[] = [];
    alert: any;
    alertId: any;
    newNote: string;
    transactions: any[] = [];

    ngOnInit() {
     
        this.contextService.currentSection = "alerts";
        this.alertId = this.route.snapshot.queryParams['i'];
        this.loadAlertDetail();      
    }   
    
    loadAlertDetail() {
        this.spinnerService.postStatus('Loading');
        let observable$ = this.alertService.loadAlertDetail(this.alertId);
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.alert = data.alert;
                    this.transactions = data.transactions;
                }
            },
            (err) => { },
            () => {
                this.spinnerService.finishCurrentStatus();
            });   
    }   

    saveNewNote() {
        var data = {
            note: this.newNote, alertID: this.alert.alertID
        };
        this.spinnerService.postStatus('Adding Note');
        let $observable = this.proxyService.Put("alert/addNote", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Note added" });
                    this.alert.notes.push(data.note);
                    this.newNote = "";
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

    onSaveWork($event) {
        var _self = this;
        this.spinnerService.postStatus('Saving Work');
        var request = { chargeBack: this.alert.chargeBack };
        let $observable = this.proxyService.Post("alert/saveChargeBack/", request);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Alert Work Saved" });
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


    markInProgress() { 
        var _self = this;        
        this.spinnerService.postStatus('Marking Alert In Progress');
        var request = { alertID: this.alert.alertID };
        let $observable = this.proxyService.Post("alert/inprogress/", request);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Alert Set To In Progress" });
                    this.alert.alertStatusID = _self.constants.alertStatusInProgress;
                    this.alert.alertStatus.description = "In Progress";
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

    markResolved() {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to mark this alert resolved?',
            accept: () => {
                this.spinnerService.postStatus('Marking Alert Resolved');
                var request = { alertID: this.alert.alertID };
                let $observable = this.proxyService.Post("alert/resolve/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Alert Resolved" });
                            _self.router.navigate(['/alert/alert-list']);
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
        });
    }
}