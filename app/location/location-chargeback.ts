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
        let $observable = this.proxyService.Get("location/" + this.locationID);
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
}