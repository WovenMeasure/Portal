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
import { SelectItem, Message} from 'primeng/primeng';

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

    msgs: Message[] = [];
    alerts: any[];
    allAlerts: any[];
    alertFromDate: Date;
    alertToDate: Date;
    inProgressOnly: boolean = false;

    ngOnInit() {
        this.contextService.currentSection = "alerts";

        let tab: string = this.contextService.currentTab;
        this.inProgressOnly = this.contextService.showInProgressOnly;
        if (tab)
            this.alertService.currentAlertType = this.constants.getAlertTypeByConstant(tab);


        this.alertFromDate = this.contextService.currentAlertFilterFromDate;
        this.alertToDate = this.contextService.currentAlertFilterToDate;


        this.loadAlerts();
    }       

    loadAlerts() {
        this.spinnerService.postStatus('Loading Alerts');
        let observable$ = this.alertService.loadAlerts(this.alertFromDate, this.alertToDate);
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.alerts = data.alerts;
                    this.allAlerts = data.alerts;
                    if (this.inProgressOnly) {
                        this.alerts = this.allAlerts.filter((a) => { return a.alert.alertStatusID == this.constants.alertStatusInProgress });
                    }
                    else {
                        this.alerts = this.allAlerts;
                    }
                }
            },
            (err) => { },
            () => {
                this.spinnerService.finishCurrentStatus();
            });   
    }

    toggleShowInProgress() {
        this.inProgressOnly = !this.inProgressOnly;
        this.contextService.showInProgressOnly = this.inProgressOnly;
        if (this.inProgressOnly) {
            this.alerts = this.allAlerts.filter((a) => { return a.alert.alertStatusID == this.constants.alertStatusInProgress });
        }
        else {
            this.alerts = this.allAlerts;
        }

           
    }

    filterByDate() {
        this.contextService.currentAlertFilterFromDate = this.alertFromDate;
        this.contextService.currentAlertFilterToDate = this.alertToDate;
        this.loadAlerts();
    }

    tabClick(tab: string) {
        this.alertService.currentAlertType = this.constants.getAlertTypeByConstant(tab);
        this.contextService.currentTab = tab;
        this.loadAlerts();
    }

    edit(alert: any) { 
        if (alert.alert.alertTypeID == this.constants.getAlertTypeByConstant("LOC").alertTypeID) {
            this.router.navigate(['/alert/alert-detail-location'], { queryParams: { i: alert.alert.alertID } });
        }
        else if (alert.alert.ruleType.ruleTypeID == this.constants.alertRuleTypeChargeBackOrDispute) {
            this.router.navigate(['/alert/alert-detail-chargeback'], { queryParams: { i: alert.alert.alertID } });
        }
        else { /*....*/
            this.router.navigate(['/alert/alert-detail'], { queryParams: { i: alert.alert.alertID } });
        }
    }   

    onRowSelect(event) {
        this.edit(event.data);
    }

    dismiss(alert: any) {
        let $observable = this.proxyService.Post("alert/dismiss", { alertID: alert.alertID });
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "Alert dismissed" });
                    this.alerts.splice(this.alerts.indexOf(alert), 1);
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