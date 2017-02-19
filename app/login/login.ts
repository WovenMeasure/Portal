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
    coachImage: string;
    erroMsgShow: boolean;
    erroMsg2Show: boolean;
    step: number;
    auth2FACode: string;
    auth2FAResponse: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private spinnerService: SpinnerService,
                private constants: Constants,
                private translationService: TranslationService) {

       }

    

    ngOnInit() {
        this.erroMsgShow = false;
        this.erroMsg2Show = false;
        this.step = 1;
       
    }
    

    onLogin(ev) {       
        this.spinnerService.postStatus(this.translationService.translate('Logging in'));
        this.authenticationService.Login2FA(this.email, this.password).subscribe(
            res => {
                if (res.success) {             
                    this.auth2FAResponse = res;
                    this.step = 2;
                }
                else {
                    this.erroMsgShow = true;
                }
            },
            null,
            () => { this.spinnerService.finishCurrentStatus(); }
        );
    
    }

    completeLogin() {
        if (this.auth2FACode.length == 0)
            return;

        this.spinnerService.postStatus('Validating Code');
        this.authenticationService.LoginFinish2FA(this.auth2FAResponse.userId, this.auth2FACode).subscribe(
            res => {
                if (res.success) {
                    this.router.navigate(['dash-main']);
                }
                else {
                    this.erroMsg2Show = true;
                }
            },
            null,
            () => { this.spinnerService.finishCurrentStatus(); }
        );

    }
}