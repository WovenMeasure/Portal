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
import { SelectItem, Message} from 'primeng/primeng';

@Component({
    templateUrl: 'reports-list.html'
})
export class ReportListComponent {   
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
    reports: any[];
    ngOnInit() {
        this.contextService.currentSection = "reports";
        this.reports = new Array();
        this.reports.push(
            {
                name: 'Credit Card Chargeback Disputes',
                url: 'http://portal-laz.wovenmeasure.com/ReportServer/Pages/ReportViewer.aspx?%2fReport+Project1%2fCCChargeBackDispute&rs:Command=Render'
            }
        );
    }       
    
}