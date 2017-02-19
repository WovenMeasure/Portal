//our root app component
import {Component} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ChangePasswordService} from '../changePassword/changePassword-service';
import { SpinnerService } from '../common/services/spinner-service';
import { ProviderService } from '../common/services/provider-service';
import { Provider } from '../dto/provider';
import { TranslationService } from '../common/services/translation-service';

@Component({
    templateUrl: 'changePassword.tmpl.html'
})

export class ChangePasswordComponent {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private changePasswordService: ChangePasswordService,
        private spinnerService: SpinnerService,
        private translationService: TranslationService) {
    }

    email: string;
    password: string;
    confirmPassword: string;
    message: string;
    token: string;
    condition: boolean;
    coachImage: string;
    provider: Provider;
    messageShow: boolean;

    ngOnInit() {

        this.route.queryParams.forEach((params: Params) => {
            this.token = params['t'];
            console.log("token = " + this.token);
        });
        this.condition = false;
        this.messageShow = false;
    }

    onChangePassword(ev) {
        this.spinnerService.postStatus(this.translationService.translate('Changing Password'));

        this.changePasswordService.changePassword(this.email, this.password, this.token).subscribe(
            res => {
                if (res.success) {
                    //this.messageShow = false;
                    this.condition = true;
                    
                }
                else {
                    console.log(res.responseMessage)
                    this.messageShow = true;
                    this.message = "Uh oh!  You did not enter a valid email.  Please try again."; //res.responseMessage //coming soon fancy message service
                }
            },
            complete => { this.spinnerService.finishCurrentStatus(); }
        );

    }

}
