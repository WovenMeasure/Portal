//our root app component
import {Component, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../common/services/authentication-service';
import { ContextService } from '../common/services/context-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import {Constants } from '../common/constants';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';


@Component({
    templateUrl: 'dashboard-main.html'
})
export class DashboardMainComponent {
    email: string;
    password: string;
    message: string;
    coachImage: string;
    erroMsgShow: boolean;
   
    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private constants: Constants,
                private translationService: TranslationService,
                private contextService:ContextService) {

       }

    

    ngOnInit() {       
       
    }

    associationsClick() {
        this.router.navigate(['association/association-list']);
    }


    triggerRoute(val: string) {

        switch (val) {
            case 'association':
                this.router.navigate(['association/association-list']);
                break;
            case 'providers':
                this.router.navigate(['providers']);
                break;
            case 'admin':
                this.router.navigate(['admin']);
                break;
            case 'offSite':
                this.router.navigate(['offSite']);
                break;
            case 'events':
                this.router.navigate(['events']);
                break;
        }
        
    }
    
}