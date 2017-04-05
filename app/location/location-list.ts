//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from "../dto/merchant";
import { SelectItem, Message} from 'primeng/primeng';

@Component({
    templateUrl: 'location-list.html'
})
export class LocationListComponent {   
    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private ngbModal: NgbModal,
                private translationService: TranslationService) {

    }    

    msgs: Message[] = [];
    locations: any[];

    ngOnInit() {
        this.contextService.currentSection = "locations";
        this.loadLocations();
    }       

    loadLocations() {
        this.spinnerService.postStatus('Loading Locations');
        let $observable = this.proxyService.Get("location/list/0/3000");
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.locations = data.locations;
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

    edit(location: any) {
        this.router.navigate(['/location/location-detail'], { queryParams: { i: location.locationID } });
    }

    onRowSelect(event) {
        this.edit(event.data);
    }
}