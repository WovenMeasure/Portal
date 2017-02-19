import { NgModule, APP_INITIALIZER} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { AppComponent }   from "./app.component";
import { SafePipe } from './common/pipes/pipes';
import { MomentPipe } from './common/pipes/pipes';
import { HttpModule, JsonpModule } from "@angular/http";
import { HeaderComponent } from "./shared/header/header";
import { Constants } from "./common/constants";
import { Ng2PaginationModule } from 'ng2-pagination';
import {Ng2PageScrollModule} from 'ng2-page-scroll/ng2-page-scroll';
import { WVDatepickerModule } from './shared/datepicker/datepicker.module';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import {InputTextModule, DataTableModule, ButtonModule, DialogModule, GrowlModule, DropdownModule} from 'primeng/primeng';

/*************************************************************Service*******************************************************************/
import { AuthenticationService } from "./common/services/authentication-service";
import { SpinnerService } from "./common/services/spinner-service";
import { LoggerService } from "./common/services/logger-service";
import { ContextService } from "./common/services/context-service";
import { ProxyService } from "./common/services/proxy-service";
import { TranslationService } from "./common/services/translation-service";
import { ProviderService } from "./common/services/provider-service";
import { ResetPasswordService} from "./resetPassword/resetPassword-service";
import { ChangePasswordService} from "./changePassword/changePassword-service";

/*************************************************************Components*******************************************************************/
import { routing, appRoutingProviders } from "./app.routing";
import { FileUploadComponent } from "./shared/fileupload/fileupload";
import { LoginComponent } from "./login/login"; 
import { ResetPasswordComponent } from "./resetPassword/resetPassword";
import { ChangePasswordComponent } from './changePassword/changePassword'
import { ImageCropperComponent } from 'ng2-img-cropper';
import { DashboardMainComponent } from './dashboard/dashboard-main';
import { MasterPageComponent } from './shared/masterpage/masterpage';

/*************************************************************Directives/dto*******************************************************************/
import { CanActivateGuard } from "./app.authguard";
import { PasswordValidator} from './changePassword/changePassword.directive';
import { CredentialInfo} from "./dto/participant-info";
import { ContactInfo} from "./dto/participant-info";
import { InsuranceInfo} from "./dto/participant-info";
import { TermsConditionInfo} from "./dto/participant-info";
import { ParticipantContext} from "./dto/participant-info";
import { QuestAnswer } from './dto/assessment';
import { Attachments } from './dto/attachment';



@NgModule({
    imports: [BrowserModule, routing, HttpModule, JsonpModule, FormsModule, Ng2PaginationModule, Ng2PageScrollModule.forRoot(), NgbModule.forRoot(), WVDatepickerModule.forRoot(), DateValueAccessorModule,
        DataTableModule, GrowlModule, DropdownModule],
    declarations: [
        AppComponent, SafePipe, MomentPipe, HeaderComponent, ImageCropperComponent,
        MasterPageComponent,         
        LoginComponent, ResetPasswordComponent, ChangePasswordComponent, 
        PasswordValidator, FileUploadComponent, DashboardMainComponent
       ],

    entryComponents: [],

    bootstrap: [AppComponent],

    providers: [
        appRoutingProviders, ResetPasswordService,
        TranslationService,
        {
            provide: APP_INITIALIZER,
            deps: [TranslationService, ProxyService],
            useFactory: (translationServ: TranslationService) => () => translationServ.init(),
            multi: true
        },
        ChangePasswordService, ContextService, ProxyService,
        AuthenticationService, SpinnerService, LoggerService,
        ProviderService, Constants, CanActivateGuard, 
        CredentialInfo, ContactInfo,
        NgbModalRef]
})

export class AppModule { }
 