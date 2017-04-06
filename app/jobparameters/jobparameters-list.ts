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
    templateUrl: 'jobparameters-list.html'
})
export class JobParametersListComponent {   
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
    jobParameters: any[];
    selectedParam: any;
    parameter: any;
    displayDialog: boolean = false;

    ngOnInit() {
        this.contextService.currentSection = "jobparams";
        this.loadParameters();
    }       

    loadParameters() {
        this.spinnerService.postStatus('Loading Parameters');
        let $observable = this.proxyService.Get("jobparam/list");
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.jobParameters = data.jobParameters;
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

    onRowSelect(event) {
        this.parameter = this.clone(event.data);
        this.displayDialog = true;
    }

    clone(c) {
        var cloned = {};
        for (let prop in c) {
            cloned[prop] = c[prop];
        }
        return cloned;
    }

    findSelectedIndex(): number {
        return this.jobParameters.indexOf(this.selectedParam);
    }

    save() {
        this.jobParameters[this.findSelectedIndex()] = this.parameter;
        var data = {
            jobParameter: this.parameter
        };

        this.spinnerService.postStatus('Saving Parameter');
        let $observable = this.proxyService.Post("jobparam/update", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.parameter = null;
                    this.displayDialog = false;
                    this.msgs.push({ severity: 'success', summary: "Parameter updated" });
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

    cancel() {
        this.displayDialog = false;
    }    

}