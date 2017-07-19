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
import { SelectItem, Message, DataTable } from 'primeng/primeng';

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

    terminated: boolean = false;
    msgs: Message[] = [];
    locations: any[];
    localStorageGridOptionsKey: string;
    gridOptions = {
        first: 0,
        rows: 10,
        sortField: 'title',
        sortOrder: 1,
        filter: ''
    };
    @ViewChild(DataTable) dataTable: DataTable;
    loadGridSortOptions() {
        var saved = this.contextService.getGridOption(this.localStorageGridOptionsKey);
        if (saved) {
            setTimeout(() => {
                this.gridOptions = saved;
                this.dataTable.globalFilter.value = this.gridOptions.filter;
                this.dataTable.sortField = this.gridOptions.sortField;
                this.dataTable.sortOrder = this.gridOptions.sortOrder;                
            }, 0);
        }
        else {
            this.gridOptions.first = 1;
            this.gridOptions.rows = 20;
        }

    }
    loadGridPageOptions() {
        var saved = this.contextService.getGridOption(this.localStorageGridOptionsKey);
        if (saved) {
            setTimeout(() => {
                this.dataTable.filter("", "", "");
                this.dataTable.paginate();               
            }, 0);
        }
        else {
            this.gridOptions.first = 1;
            this.gridOptions.rows = 20;
        }

    }

    onSort(e: { field: string, order: number }) {
        this.gridOptions.sortField = e.field;
        this.gridOptions.sortOrder = e.order;
        this.gridOptions.first = 0;
        this.contextService.setGridOption(this.localStorageGridOptionsKey, this.gridOptions);
    }

    onPage(e: { first: number, rows: number }) {
        this.gridOptions.rows = e.rows;
        this.gridOptions.first = e.first;
        this.contextService.setGridOption(this.localStorageGridOptionsKey, this.gridOptions);
    }

    onFilter(e) {
        this.gridOptions.filter = this.dataTable.globalFilter.value;
        this.contextService.setGridOption(this.localStorageGridOptionsKey, this.gridOptions);
    }

    ngOnInit() {
        this.localStorageGridOptionsKey = "locationlist";
        this.contextService.currentSection = "locations";
        this.loadLocations();
    }       

    onSelectionChange() {
        this.loadLocations();
    }

    loadLocations() {
        this.loadGridSortOptions();
        this.spinnerService.postStatus('Loading Locations');
        let $observable = this.proxyService.Get("location/list/0/3000/" + this.terminated);
        $observable.subscribe(
            data => {
                if (data.success) {
                    this.locations = data.locations;
                    this.loadGridPageOptions();
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