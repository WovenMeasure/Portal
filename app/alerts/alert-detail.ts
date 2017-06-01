import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
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
    templateUrl: 'alert-detail.html',
    providers: [ConfirmationService]
})
export class AlertDetailComponent {    
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
    location: any;

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
                    this.location = data.location;
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

    deleteNote(note) {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to remove this note?',
            accept: () => {
                this.spinnerService.postStatus('Removing Note');
                let $observable = this.proxyService.Delete("alert/removeNote/" + note.noteID);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Note removed" });
                            this.alert.notes.splice(this.alert.notes.indexOf(note), 1);
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
    markInProgress() { 
        var _self = this;        
        this.spinnerService.postStatus('Marking Alert In Progress');
        var request = { alertID: this.alert.alertID };
        let $observable = this.proxyService.Post("alert/inprogress/", request);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Alert Set To In Progress" });
                    this.alert.workItemStatusID = _self.constants.alertStatusInProgress;
                    this.alert.workItemStatus.description = "In Progress";
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