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
    templateUrl: 'job-log-list.html'
})
export class JobLogListComponent {   
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
    logs: any[];

    ngOnInit() {
        this.contextService.currentSection = "logs";
        this.loadLogs();
    }       

    loadLogs() {
        this.spinnerService.postStatus('Loading Alerts');
        let $observable = this.proxyService.Get("log/0/1000");
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.logs = data.logEntries;
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