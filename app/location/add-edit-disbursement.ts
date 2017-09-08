//our root app component
import { Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem, Message, DataTable } from 'primeng/primeng';


@Component({ 
    templateUrl: 'add-edit-disbursement.html'
})
export class AddEditDisbursementComponent {    

    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private activeModal: NgbActiveModal,
                private translationService: TranslationService) {
      

    }   

    arpDisbursementLocation: any;
    arpDisbursement: any;
    locationId: any;

    ngOnInit() {
        if (this.arpDisbursement.disbursementId <= 0) {
            this.arpDisbursement.locationDisbursements = [];
            this.arpDisbursement.locationDisbursements.push({ disbursementLocationId: 0, disbursementId: this.arpDisbursement.disbursementId, locationId: this.locationId })
        }
    }
    

    close() {
        this.activeModal.close();
    }

    save() {
        if (this.arpDisbursement) {
            //save to db
            this.spinnerService.postStatus('Saving Work');
            var $observable;

            if (this.arpDisbursement.disbursementId > 0) {
                $observable = this.proxyService.Post("disbursement/updateDisbursement/", this.arpDisbursement);
            }
            else {
                $observable = this.proxyService.Put("disbursement/addDisbursement", this.arpDisbursement);
            }

            $observable.subscribe(
                data => {
                    if (data.success) {
                        if (this.arpDisbursement.disbursementId == 0) {
                            this.arpDisbursement.disbursementId = parseInt(data.recordIDString);
                            for (var n = 0; n < this.arpDisbursement.locationDisbursements.length; n++) {
                                this.arpDisbursement.locationDisbursements[n].disbursementId = this.arpDisbursement.disbursementId;
                            }
                        }

                        this.activeModal.close(this.arpDisbursement);
                    }
                    else {
                        this.activeModal.dismiss(data.errorMessage)
                    }
                },
                (err) => {
                    this.activeModal.dismiss(err);
                },
                () => {
                    this.spinnerService.finishCurrentStatus();
                });            
        }     
    }

    removeLocation(event, index) {
        this.arpDisbursement.locationDisbursements.splice(index, 1);
    }

    addLocation(event) {
        event.stopPropagation();
        this.arpDisbursement.locationDisbursements.push({ disbursementLocationId: 0, disbursementId: this.arpDisbursement.disbursementId })
    }

}