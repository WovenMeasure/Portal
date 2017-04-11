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
    alertDate: Date;
    inProgressOnly: boolean = false;

    ngOnInit() {
        this.contextService.currentSection = "alerts";
        this.alertDate = new Date();

        let tab: string = this.contextService.currentTab;
        this.inProgressOnly = this.contextService.showInProgressOnly;
        if (tab)
            this.alertService.currentAlertType = this.constants.getAlertTypeByConstant(tab);


        this.alertDate = this.contextService.currentAlertFilterDate;

        this.loadAlerts();
    }       

    loadAlerts() {
        this.spinnerService.postStatus('Loading Alerts');
        let observable$ = this.alertService.loadAlerts(this.alertDate);
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.alerts = data.alerts;
                    this.allAlerts = data.alerts;
                    if (this.inProgressOnly) {
                        this.alerts = this.allAlerts.filter((a) => { return a.alertStatusID == this.constants.alertStatusInProgress });
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
            this.alerts = this.allAlerts.filter((a) => { return a.alertStatusID == this.constants.alertStatusInProgress });
        }
        else {
            this.alerts = this.allAlerts;
        }


    }

    filterByDate() {
        this.contextService.currentAlertFilterDate = this.alertDate;
        this.loadAlerts();
    }

    tabClick(tab: string) {
        this.alertService.currentAlertType = this.constants.getAlertTypeByConstant(tab);
        this.contextService.currentTab = tab;
        this.loadAlerts();
    }

    edit(alert: any) { 
        if (alert.alertTypeID == this.constants.getAlertTypeByConstant("LOC").alertTypeID) {
            this.router.navigate(['/alert/alert-detail-location'], { queryParams: { i: alert.alertID } });
        }
        else { /*....*/
            this.router.navigate(['/alert/alert-detail'], { queryParams: { i: alert.alertID } });
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