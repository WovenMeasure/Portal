//our root app component
import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../../common/services/authentication-service';
import { SpinnerService } from '../../common/services/spinner-service';
import { ContextService } from '../../common/services/context-service';
import { TranslationService } from '../../common/services/translation-service';
import {Constants } from '../../common/constants';

@Component({
    templateUrl: 'masterpage.html'
})
export class MasterPageComponent {
    constructor(private router: Router,
                private location: Location,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private constants: Constants,
                private contextService: ContextService,
                private translationService: TranslationService) {

       }   
     
    ngOnInit() {
       
    }  

    logout() {
        this.authenticationService.startSignoutMainWindow();
    }

    back() {
        this.location.back();
    }
    
}