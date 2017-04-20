//our root app component
import {Component, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import { TranslationService } from '../common/services/translation-service';
import {Constants } from '../common/constants';

import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
@Component({
    templateUrl: 'login.tmpl.html'
})
export class LoginComponent {
    email: string;
    password: string;
    message: string; 
    val: number;
    erroMsgShow: boolean;
    erroMsg2Show: boolean;
  

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private constants: Constants,
                private translationService: TranslationService) {
            this.val = 15.23;
       } 

    

    ngOnInit() {
        this.erroMsgShow = false;
        this.erroMsg2Show = false;
       
    }
    

    onLogin(ev) {       
        this.spinnerService.postStatus(this.translationService.translate('Logging in'));
        this.authenticationService.Login(this.email, this.password).subscribe(
            res => {
                this.router.navigate(['dash-main']);               
            },
            (error) => {
                this.erroMsgShow = true;
            },
            () => { this.spinnerService.finishCurrentStatus(); }
        );
    
    }
    
}