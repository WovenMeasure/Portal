import {Component, ViewChild} from '@angular/core';
import { ContextService } from './common/services/context-service';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { AuthenticationService } from './common/services/authentication-service';
@Component({
    selector: 'laz',
    templateUrl: 'app.tmpl.html'
})
export class AppComponent {
    loggedIn: boolean = false;
    constructor(private contextService: ContextService, private authService: AuthenticationService) {
        this.authService.isLoggedInObs()
            .subscribe(flag => {
                this.loggedIn = flag;
                if (!flag) {
                    this.authService.startSigninMainWindow();
                }
            });

    }    
}
  