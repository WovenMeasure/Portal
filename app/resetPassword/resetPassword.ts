import {Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AuthenticationService} from '../common/services/authentication-service';
import { SpinnerService } from '../common/services/spinner-service';
import {ResetPasswordService} from '../resetPassword/resetPassword-service';
import { TranslationService } from '../common/services/translation-service';

@Component({
    templateUrl: 'resetPassword.tmpl.html'
})

export class ResetPasswordComponent {
    email: string;
    coachImage: string;
    message: string;
    condition: boolean;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private resetPasswordService: ResetPasswordService,
        private spinnerService: SpinnerService,
        private translationService: TranslationService) {
    }

    ngOnInit() {
        this.coachImage = "/app/images/Login-coach-image.jpg"; //needs to come from provider service, get random provider
        this.condition = false;
    }

    onResetPassword(ev) {
        this.spinnerService.postStatus(this.translationService.translate('Sending Email'));
        this.resetPasswordService.resetPassword(this.email).subscribe(
            res => {
                if (res.success) {
                    this.condition = true;
                    //this.router.navigate(['dashboard']);
                    //this.message = "Success! Check your email for instructions to reset your password.";
                }
                else {
                    this.message = "Looks like your email is incorrect.Please try again or sign up for LAZ Health.";
                }
            },
            complete => { this.spinnerService.finishCurrentStatus(); }
        );

    }


}