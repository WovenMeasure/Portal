//our root app component
import {Component, ComponentRef, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../../common/services/authentication-service';
import { SpinnerService } from '../../common/services/spinner-service';
import { TranslationService } from '../../common/services/translation-service';
import { ContextService } from '../../common/services/context-service';
import {Constants } from '../../common/constants';
import { ProxyService } from "../../common/services/proxy-service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from "../../dto/merchant";
import {SelectItem} from 'primeng/primeng';

@Component({
    templateUrl: 'merchant-list.html'
})
export class MerchantListComponent {   
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
    
    merchants: Merchant[];
    regions: SelectItem[];
    selectedRegion: string;

    ngOnInit() {
        this.contextService.currentSection = "merchant";
        this.spinnerService.postStatus('Loading');
      
        this.merchants = [
            new Merchant("122012", "10", new Date(2010, 5, 1)),
            new Merchant("540973", "04", new Date(2010, 1, 1)),
            new Merchant("540976", "04", new Date(2008, 9, 1)),
            new Merchant("540978", "04", new Date(2010, 2, 1)),
        ];

        this.spinnerService.finishCurrentStatus();
    }       
    
}