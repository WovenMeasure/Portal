//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import { ContextService } from '../common/services/context-service';
import {Constants } from "../common/constants";
import { ProxyService } from "../common/services/proxy-service";
import {AlertService } from "./alert-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from "../dto/merchant";
import {SelectItem} from 'primeng/primeng';

@Component({
    templateUrl: 'alert-list.html'
})
export class AlertListComponent {   
    constructor(private router: Router, 
                private componentFactoryResolver: ComponentFactoryResolver,
                private proxyService: ProxyService,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private contextService: ContextService,
                private constants: Constants,
                private alertService: AlertService,
                private ngbModal: NgbModal,
                private translationService: TranslationService) {

    }    

    alerts: any[];
    alertDate: Date;

    ngOnInit() {
        this.contextService.currentSection = "alerts";
        this.alertDate = new Date();
        this.loadAlerts();
    }       

    loadAlerts() {
        this.spinnerService.postStatus('Loading');
        let observable$ = this.alertService.loadAlerts();
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.alerts = data.alerts;
                }
            },
            (err) => { },
            () => {
                this.spinnerService.finishCurrentStatus();
            });   
    }

    tabClick(tab: string) {
        this.alertService.currentAlertType = this.constants.getAlertTypeByConstant(tab);
        this.loadAlerts();
    }

    edit(alert: any) { 
        if (alert.alertTypeID == this.constants.getAlertTypeByConstant("LOC").alertTypeID) {
            this.router.navigate(['/alert/alert-detail-location'], { queryParams: { i: alert.alertID } });
        }
        else { /*....*/
        }
    }   
}