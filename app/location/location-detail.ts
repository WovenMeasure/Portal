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
import {SelectItem} from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';
import { AddEditReturnComponent } from "./add-edit-return";
import { AddEditDisbursementComponent } from './add-edit-disbursement';
import * as _ from 'underscore';

@Component({
    templateUrl: 'location-detail.html',
    providers: [ConfirmationService]
})
export class LocationDetailComponent {   
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
    states: SelectItem[];
    regions: SelectItem[];
    newLocationID: string = '';
    addModal: any;
    ngOnInit() {
        var _self = this;
        this.contextService.currentSection = "locations";
        this.locationId = this.route.snapshot.queryParams['i'];
        this.loadStates();
        this.loadRegions().then(function () {
            _self.loadLocationDetail();
        })
    }   

    loadStates() { 
        this.states = [];
        this.states.push({ label: 'Select State', value: null });
        for (let n: number = 0; n < this.constants.US_States.length; n++) {
            this.states.push({ label: this.constants.US_States[n].state, value: this.constants.US_States[n].postCode });
        }
    }

    loadRegions() {
        let promise = new Promise((resolve, reject) => {
            this.regions = [];
            let observable$ = this.lookupService.loadRegions();
            observable$.subscribe(
                data => {
                    if (data.success) {
                        this.regions.push({ label: 'Select Region', value: null });
                        for (let n: number = 0; n < data.regions.length; n++) {
                            this.regions.push({ label: data.regions[n].regionDesc, value: data.regions[n].strRegionID });
                        }
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
        });
        return promise;     
    }

    loadLocationDetail() {
        this.spinnerService.postStatus('Loading Location');
        let $observable = this.proxyService.Get("location/" + this.locationId);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.location = data.location;
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

    onSaveLocation($event) {
        //save
        var data = {
            newLocationID: this.newLocationID,
            location: this.location
        };
        this.spinnerService.postStatus('Saving Location');
        let $observable = this.proxyService.Post("location/update", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Location updated" });
                    if (this.newLocationID)
                    {
                        this.location.oldLocationID = this.location.locationID;
                        this.location.locationID = this.newLocationID;
                        this.newLocationID = '';
                    }
                }
                else {
                    this.msgs.push({ severity: 'error', summary: data.responseMessage });
                }
            },
            (err) => {
                this.msgs.push({ severity: 'error', summary: err });
            },
            () => {
                this.spinnerService.finishCurrentStatus();
            });
    }

    markTerminated(location) {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to terminate this location?',
            accept: () => {
                this.spinnerService.postStatus('Marking Location Terminated');
                var request = { locationID: location.locationID, alertID: 0 };
                let $observable = this.proxyService.Post("location/term/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location terminated" });
                            location.terminated = 1;
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

    markActive(location) {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to activate this location?',
            accept: () => {
                this.spinnerService.postStatus('Marking Location Active');
                var request = { locationID: location.locationID, alertID: 0 };
                let $observable = this.proxyService.Post("location/activate/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location Activated" });
                            location.terminated = 0;
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

    markIgnored(location) {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to ignore this location?',
            accept: () => {
                this.spinnerService.postStatus('Marking Location Ignored');
                var request = { locationID: location.locationID, alertID: 0 };
                let $observable = this.proxyService.Post("location/ignore/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location Ignored" });
                            location.ignored = true;                        }
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


    markNotIgnored(location) {
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to not ignore this location?',
            accept: () => {
                this.spinnerService.postStatus('Marking Location Not Ignoree');
                var request = { locationID: location.locationID, alertID: 0 };
                let $observable = this.proxyService.Post("location/notignore/", request);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Location Update Done" });
                            location.ignored = false;
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

    onCaseSelect(event) {
        if (event.data.type == 1) {
            this.router.navigate(['/alert/alert-detail-chargeback'], { queryParams: { i: event.data.id } });
        }
        else {
            this.router.navigate(['/location/location-chargeback'], { queryParams: { i: event.data.id, l: this.locationId } });
        }
    }


    addChargeback() {
        this.router.navigate(['/location/location-chargeback'], { queryParams: { i: 0, l: this.locationId } });
    }

    dismiss($event: any, chargeBack: any) {
        $event.stopPropagation();
        var _self = this;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this case?',
            accept: () => {
                this.spinnerService.postStatus('Deleting case');
                let $observable = this.proxyService.Delete("cases/delete/" + chargeBack.cbid + "/" + chargeBack.type + "/" + this.locationId);
                $observable.subscribe(
                    data => {
                        if (data.success) {
                            this.msgs.push({ severity: 'success', summary: "Case deleted" });
                            var index = this.cases.indexOf(chargeBack);
                            this.cases.splice(index, 1);
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

    onDisbReturnSelect(event) {
        var _self = this;
      
        this.addModal = this.ngbModal.open(AddEditDisbursementComponent, {
            backdrop: 'static', keyboard: false, size: 'lg'
        });

        const contentComponentInstance = this.addModal.componentInstance;
        if (event.data.dateRequested) {
            event.data.dateRequested = new Date(event.data.dateRequested);
        }
        if (event.data.checkDate) {
            event.data.checkDate = new Date(event.data.checkDate);
        }

        _.each(event.data.locationDisbursements, function (e) {
            if (e.dateSignedFor)
                e.dateSignedFor = new Date(e.dateSignedFor);
        });

        contentComponentInstance.arpDisbursement = event.data;

        this.addModal.result.then(function (ret: any) {
            if (ret) {
                _self.msgs.push({ severity: 'success', summary: "Disbursement Updated" });
            }
        },
            function (dismissReason: any) {
                _self.msgs.push({ severity: 'error', summary: dismissReason });
            }
        );
    }

    addDisbursement() {
        var _self = this;
        this.addModal = this.ngbModal.open(AddEditDisbursementComponent, {
            backdrop: 'static', keyboard: false, size: 'lg'
        });

        const contentComponentInstance = this.addModal.componentInstance;
        contentComponentInstance.arpDisbursement = { disbursementId: 0 };
        contentComponentInstance.locationId = this.locationId;

        this.addModal.result.then(function (ret: any) {
            if (ret) {
                _self.msgs.push({ severity: 'success', summary: "Disbursement Added" });
                _self.disbursements.push(ret);
            }
        },
            function (dismissReason: any) {
                _self.msgs.push({ severity: 'error', summary: dismissReason });
            }
        );
    }



    onReturnSelect(event) {
        var _self = this;
        this.addModal = this.ngbModal.open(AddEditReturnComponent, {
            backdrop: 'static', keyboard: false, size: 'lg'
        });

        const contentComponentInstance = this.addModal.componentInstance;
        if (event.data.dateReturned) {
            event.data.dateReturned = new Date(event.data.dateReturned);
        }        
        contentComponentInstance.arpReturn = event.data;

        this.addModal.result.then(function (ret: any) {
            if (ret) {
                _self.msgs.push({ severity: 'success', summary: "Return Updated" });
            }
        },
            function (dismissReason: any) {
                _self.msgs.push({ severity: 'error', summary: dismissReason });
            }
        );
    }

    addReturn() {
        var _self = this;
        this.addModal = this.ngbModal.open(AddEditReturnComponent, {
            backdrop: 'static', keyboard: false, size: 'lg'
        });

        const contentComponentInstance = this.addModal.componentInstance;
        contentComponentInstance.arpReturn = { returnID: 0, locationId: this.locationId };

        this.addModal.result.then(function (ret: any) {
                if (ret) {
                    _self.msgs.push({ severity: 'success', summary: "Return Added" });
                    _self.location.arpLocationReturns.push(ret);
                }
            },
            function (dismissReason: any) {
                _self.msgs.push({ severity: 'error', summary: dismissReason});
            }
        );
    }
}