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
import {AlertService } from "./alert-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SelectItem} from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule} from 'primeng/primeng';

@Component({
    templateUrl: 'alert-detail-location.html',
    providers: [ConfirmationService]
})
export class AlertDetailLocationComponent {   
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
        this.addingLocation = false;
        this.deletingLocation = false;
        this.markingTerminated = false;
    }    

    msgs: Message[] = [];
    alert: any;
    alertId: any;
    deletingLocation: boolean;
    markingTerminated: boolean;
    addingLocation: boolean;
    states: SelectItem[];
    regions: SelectItem[];
    newLocation: any;

    ngOnInit() {
        this.contextService.currentSection = "alerts";
        this.alertId = this.route.snapshot.queryParams['i'];
        this.loadAlertDetail();
        this.loadStates();
        this.loadRegions();
    }   

    loadStates() { 
        this.states = [];
        this.states.push({ label: 'Select State', value: null });
        for (let n: number = 0; n < this.constants.US_States.length; n++) {
            this.states.push({ label: this.constants.US_States[n].state, value: this.constants.US_States[n].postCode });
        }
    }

    loadRegions() {
        this.regions = [];
        let observable$ = this.lookupService.loadRegions();
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.regions.push({ label: 'Select Region', value: null });
                    for (let n: number = 0; n < data.regions.length; n++) {
                        this.regions.push({ label: data.regions[n].regionDesc, value: data.regions[n].strRegionID });
                    }
                }
            });   
    }

    loadAlertDetail() {
        this.spinnerService.postStatus('Loading');
        let observable$ = this.alertService.loadAlertDetail(this.alertId);
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.alert = data.alert;
                }
            },
            (err) => { },
            () => {
                this.spinnerService.finishCurrentStatus();
            });   
    }   

    addLocation() {
        this.addingLocation = true;
        this.newLocation = {
            locationId: this.alert.locationID,
            name: this.alert.name,
            contactName: this.alert.contactName
        }
    }

    onAddLocation($event) {
        var _self = this;
        //save
        var data = {
            location: this.newLocation, fromAlertId: this.alert.alertID
        };
        this.spinnerService.postStatus('Adding Location');
        let $observable = this.proxyService.Put("location/add", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Location added" });
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
   

    deleteLocation() {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this location?',
            accept: () => {
                this.spinnerService.postStatus('Removing Location');
                this.deletingLocation = true;
                let $observable = this.proxyService.Delete("location/" + this.alert.locationID);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location deleted" });
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

    markTerminated() {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to terminate this location?',
            accept: () => {
                this.spinnerService.postStatus('Marking Location Terminated');
                this.deletingLocation = true;
                var request = { locationID: this.alert.locationID, alertID: this.alert.alertID };
                let $observable = this.proxyService.Post("location/term/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location terminated" });
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