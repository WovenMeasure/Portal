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
import { Merchant } from "../dto/merchant";
import {SelectItem} from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule} from 'primeng/primeng';

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
    loaded: boolean = false;
    states: SelectItem[];
    regions: SelectItem[];

    ngOnInit() {
        this.contextService.currentSection = "locations";
        this.locationId = this.route.snapshot.queryParams['i'];
        this.loadLocationDetail();
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

    loadLocationDetail() {
        this.spinnerService.postStatus('Loading Location');
        let $observable = this.proxyService.Get("location/" + this.locationId);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.location = data.location;
                    this.transactions = data.transactions;
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