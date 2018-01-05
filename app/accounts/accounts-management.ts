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
import { SelectItem } from 'primeng/primeng';
import { Message, ConfirmationService, ConfirmDialogModule, DataTable } from 'primeng/primeng';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
    templateUrl: 'accounts-management.html',
    providers: [ConfirmationService]
})
export class AccountManagementComponent {   
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
    matches: any[];
    loaded: boolean = false;
    filterLocation: string;
    filterBankAccount: string;  
    filterRegion: string;
    locations: SelectItem[];
    regions: SelectItem[];
    bankAccounts: SelectItem[];
    accounts: any[];
    currentGL: string;
    editGL: boolean;

    ngOnInit() {       
        var _self = this;
        this.filterLocation = "";
        this.filterBankAccount = "";
        this.filterRegion = "";      
        this.contextService.currentSection = "acctManagementReconcile";
        this.loadRegions().then(() => {
            this.loadBankAccounts().then(() => {
                if (_self.contextService.acctManagementSelectedAccount) {
                    _self.filterBankAccount = _self.contextService.acctManagementSelectedAccount;
                    _self.load();
                }
            });
        });
    }    
    
    loadBankAccounts() {
        this.spinnerService.postStatus('Loading Bank Accounts');
        let promise = new Promise((resolve, reject) => {
            this.bankAccounts = [];
            let observable$ = this.lookupService.loadBankAccountsWithGL();
            observable$.subscribe(
                data => {
                    if (data.success) {
                        this.accounts = data.accountNumbers;
                        this.bankAccounts.push({ label: 'Select Bank Account', value: null });
                        for (let n: number = 0; n < data.accountNumbers.length; n++) {
                            this.bankAccounts.push({ label: data.accountNumbers[n].item1.replace(/^0+/, ''), value: data.accountNumbers[n].item1 });
                        }
                        resolve();
                    }
                    else {
                        reject();
                    }
                },
                (err) => {
                    this.msgs.push({ severity: 'error', summary: err });
                },
                () => {
                    this.spinnerService.finishCurrentStatus();
                });
        });
        return promise;
    }

    loadRegions() {
        this.spinnerService.postStatus('Loading Regions');
        let promise = new Promise((resolve, reject) => {
            this.regions = [];
            let observable$ = this.lookupService.loadRegions();
            observable$.subscribe(
                data => {
                    if (data.success) {
                        this.regions.push({ label: 'Select Region', value: null });
                        for (let n: number = 0; n < data.regions.length; n++) {
                            this.regions.push({ label: data.regions[n].regionDesc, value: data.regions[n].strRegionID });
                        }
                        resolve();
                    }
                    else {
                        reject();
                    }
                },
                (err) => {
                    this.msgs.push({ severity: 'error', summary: err });
                },
                () => {
                    this.spinnerService.finishCurrentStatus();
                });
        });
        return promise;
    }

    loadLocations() {
        if (!this.filterRegion)
            return;

        this.spinnerService.postStatus('Loading Locations');
        let $observable = this.proxyService.Get("location/listForRegion/" + this.filterRegion + "/true");
        $observable.subscribe(
            data => {
                if (data.success) {
                    let locs: string[] = _.map(data.locations, (l) => {
                        return { locationID: l.locationID };
                    });
                    
                    this.locations = _.map(locs, (l) => {
                        if (l.locationID.length > 7) { l.locationID = l.locationID.substring(0, 7) };
                        return { label: l.locationID, value: l.locationID };
                    });
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

    load() {
        var _self = this;
        this.contextService.acctManagementSelectedAccount = this.filterBankAccount;
        if (!this.filterLocation && !this.filterBankAccount) {
            _self.matches = [];
            return;
        }

        if (this.filterLocation) {
            this.router.navigate(['/accounts/location-lite'], { queryParams: { i: this.filterLocation } });
            return;
        }

        _self.editGL = false;
        _self.currentGL = _self.accounts.find((a) => { return a.item1 == this.filterBankAccount }).item2;

        this.spinnerService.postStatus('Loading...');
        let $observable = this.proxyService.Get("location/listByBankAccount/" + this.filterBankAccount);
            $observable.subscribe(
                data => {
                    if (data.success) {                     
                        _self.matches = data.locations;
                    }
                    else {
                        _self.msgs.push({ severity: 'error', summary: data.responseMessage });
                    }
                },
                (err) => {
                    _self.msgs.push({ severity: 'error', summary: err });
                },
                () => {
                    _self.spinnerService.finishCurrentStatus();
                });
        
    }   

    filter() {
        this.load();
    }    

    onRowSelect(event) {
        this.router.navigate(['/accounts/location-lite'], { queryParams: { i: event.data.locationID } });
    }
    
    saveGL() {
        var data = {
            dda: this.filterBankAccount,
            gl: this.currentGL
        };
        this.spinnerService.postStatus('Updating GL Account Number');
        let $observable = this.proxyService.Post("location/assignGLAccountNo", data);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.msgs.push({ severity: 'success', summary: "GL Account Updated" });
                    this.editGL = false;
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