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
    templateUrl: 'add-edit-theft.html'
})
export class AddEditTheftComponent {    

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

    arpTheft: any;
    locationId: any;

    ngOnInit() {
       
    }
    

    close() {
        this.activeModal.close();
    }

    save() {
        if (this.arpTheft) {
            //save to db
            this.spinnerService.postStatus('Saving Work');
            var $observable;

            if (this.arpTheft.theftReplenishId > 0) {
                $observable = this.proxyService.Post("theft/updateTheft", this.arpTheft);
            }
            else {
                $observable = this.proxyService.Put("theft/addTheft", this.arpTheft);
            }

            $observable.subscribe(
                data => {
                    if (data.success) {
                        if (this.arpTheft.theftReplenishId == 0) {
                            this.arpTheft.theftReplenishId = parseInt(data.recordIDString);
                        }

                        this.activeModal.close(this.arpTheft);
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
}