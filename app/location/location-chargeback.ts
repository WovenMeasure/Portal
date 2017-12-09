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
import { Message, ConfirmationService, ConfirmDialogModule, EditorModule, SharedModule } from 'primeng/primeng';
import * as moment from 'moment';
import { FileUploadComponent } from "../shared/fileupload/fileupload";

@Component({
    templateUrl: 'location-chargeback.html',
    providers: [ConfirmationService]
})
export class LocationChargeBackComponent {    
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
    chargeBack: any;
    locationChargebackID: any;
    newNote: string;
    locationID: any;
    location: any;
    addingAttachment: boolean = false;
    attachments: any[];
    attachmentShortDescription: string;

    @ViewChild(FileUploadComponent) private _fileUpload: FileUploadComponent;

    ngOnInit() {     
        this.contextService.currentSection = "locations";
        this.locationID = this.route.snapshot.queryParams['l'];
        this.loadLocation();

        this.locationChargebackID = this.route.snapshot.queryParams['i'];
        if (this.locationChargebackID > 0) {
            this.loadChargebackDetail();
        }
        else {
            this.chargeBack = { locationID: this.locationID, notes: [] };
        }

    }   
    
    loadChargebackDetail() {
        this.spinnerService.postStatus('Loading Charge Back');
        let $observable = this.proxyService.Get("location/chargeback/" + this.locationChargebackID);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.chargeBack = data.chargeBack;  
                    if (data.chargeBack.dueDate)
                        this.chargeBack.dueDate = new Date(data.chargeBack.dueDate);

                    if (data.chargeBack.chargeBackNoticeDate)
                        this.chargeBack.chargeBackNoticeDate = new Date(data.chargeBack.chargeBackNoticeDate);

                    if (data.chargeBack.dateEmailedToField)
                        this.chargeBack.dateEmailedToField = new Date(data.chargeBack.dateEmailedToField);

                    if (data.chargeBack.dateSubmittedOrFaxed)
                        this.chargeBack.dateSubmittedOrFaxed = new Date(data.chargeBack.dateSubmittedOrFaxed);

                    if (data.chargeBack.dateOfFieldResponse)
                        this.chargeBack.dateOfFieldResponse = new Date(data.chargeBack.dateOfFieldResponse);

                    if (data.chargeBack.resultsNoticeDate)
                        this.chargeBack.resultsNoticeDate = new Date(data.chargeBack.resultsNoticeDate);

                    this.attachments = data.attachments;
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

    loadLocation() {
        this.spinnerService.postStatus('Loading Location');
        let $observable = this.proxyService.Post("location", { locationId: this.locationID });
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.location = data.location;
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
    onSaveWork() {
        this.spinnerService.postStatus('Saving Work');
        var $observable;

        if (this.locationChargebackID > 0) {
            $observable = this.proxyService.Post("location/updateChargeback/", this.chargeBack);
        }
        else {
            $observable = this.proxyService.Put("location/createChargeback/", this.chargeBack);
        }

        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Charge Back Work Saved" });
                    this.locationChargebackID = data.recordID;
                    if (this.chargeBack.workItemStatusId == 1) {
                        this.chargeBack.workItemStatus = { description: "New" };
                    }
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

    saveAttachment() {
        var data = {
            attachment: {
                entityID: this.locationChargebackID,
                shortDescription: this.attachmentShortDescription,
                fileTrueName: this._fileUpload.fileName,
                mimeType: this._fileUpload.mimeType
            },
            fileBytes: this._fileUpload.base64Response
        }; 
        this.spinnerService.postStatus('Adding Attachment');
        let $observable = this.proxyService.Put("attachment", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Attachment added" });
                    this.attachments.push(data.attachment);
                    this.attachmentShortDescription = "";
                    this._fileUpload.reset();
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

    saveNewNote() {
        var data = {
            note: this.newNote, locationChargebackID: this.locationChargebackID
        };
        this.spinnerService.postStatus('Adding Note');
        let $observable = this.proxyService.Put("location/addNote", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Note added" });
                    this.chargeBack.notes.push(data.note);
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
                let $observable = this.proxyService.Delete("location/removeNote/" + note.noteID);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Note removed" });
                            this.chargeBack.notes.splice(this.chargeBack.notes.indexOf(note), 1);
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
        this.spinnerService.postStatus('Marking Chargeback In Progress');
        var request = { locationChargebackID: this.locationChargebackID };
        let $observable = this.proxyService.Post("cases/inprogress/", request);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Chargeback Set To In Progress" });
                    this.chargeBack.workItemStatusID = _self.constants.alertStatusInProgress;
                    this.chargeBack.workItemStatus = { description: "In Progress" };
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
            message: 'Are you sure that you want to mark this chargeback resolved?',
            accept: () => {
                this.spinnerService.postStatus('Marking Chargeback Resolved');
                var request = { locationChargebackID: this.locationChargebackID };
                let $observable = this.proxyService.Post("cases/resolve/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Chargeback Resolved" });
                            this.router.navigate(['/location/location-detail'], { queryParams: { i: this.location.locationID } });
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