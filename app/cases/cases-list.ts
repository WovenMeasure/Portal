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
import { Message, ConfirmationService, ConfirmDialogModule} from 'primeng/primeng';

@Component({
    templateUrl: 'cases-list.html',
    providers: [ConfirmationService]
})
export class CasesListComponent {   
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
    cases: any[];
    loaded: boolean = false;
   
    ngOnInit() {
        this.contextService.currentSection = "cases";
        this.loadCases();
    }   


    loadCases() {
        this.spinnerService.postStatus('Loading Chargebacks/Disputes');
        let $observable = this.proxyService.Get("cases");
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.cases = data.cases;
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



    onCaseSelect(event) {
        if (event.data.type == 1) {
            this.router.navigate(['/alert/alert-detail-chargeback'], { queryParams: { i: event.data.id } });
        }
        else {
            this.router.navigate(['/location/location-chargeback'], { queryParams: { i: event.data.id, l: event.data.locationID } });
        }
    }    
}