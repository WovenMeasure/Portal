import { NgModule, APP_INITIALIZER} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DndModule } from 'ng2-dnd';
import { FormsModule }   from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { AppComponent }   from "./app.component";
import { SafePipe } from './common/pipes/pipes';
import { MomentPipe } from './common/pipes/pipes';
import { MomentUtcPipe } from './common/pipes/pipes';
import { FormatDatePipe, FormatProfitLossPipe } from './common/pipes/pipes';
import { HttpModule, JsonpModule } from "@angular/http";
import { HeaderComponent } from "./shared/header/header";
import { Constants } from "./common/constants";
import { Ng2PaginationModule } from 'ng2-pagination';
import {Ng2PageScrollModule} from 'ng2-page-scroll/ng2-page-scroll';
import { WVDatepickerModule } from './shared/datepicker/datepicker.module';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import {
    InputTextModule, DataTableModule, ButtonModule, DialogModule, GrowlModule, DropdownModule, ConfirmDialogModule, ConfirmationService,
    CalendarModule, EditorModule, SharedModule, InputMaskModule, FileUploadModule, TabViewModule, SelectButtonModule
} from 'primeng/primeng';

import { CurrencyMaskModule } from "ng2-currency-mask";

import { TabsModule, ModalModule } from 'ngx-bootstrap';


/*************************************************************Service*******************************************************************/
import { AuthenticationService } from "./common/services/authentication-service";
import { SpinnerService } from "./common/services/spinner-service";
import { LoggerService } from "./common/services/logger-service";
import { ContextService } from "./common/services/context-service";
import { ProxyService } from "./common/services/proxy-service";
import { TranslationService } from "./common/services/translation-service";
import { ResetPasswordService} from "./resetPassword/resetPassword-service";
import { ChangePasswordService} from "./changePassword/changePassword-service";
import { AlertService} from "./alerts/alert-service";
import { LookupService } from "./common/services/lookup-service";

/*************************************************************Components*******************************************************************/
import { routing, appRoutingProviders } from "./app.routing";
import { FileUploadComponent } from "./shared/fileupload/fileupload";
import { LoginComponent } from "./login/login"; 
import { ResetPasswordComponent } from "./resetPassword/resetPassword";
import { ChangePasswordComponent } from './changePassword/changePassword'
import { ImageCropperComponent } from 'ng2-img-cropper';
import { DashboardMainComponent } from './dashboard/dashboard-main';
import { MasterPageComponent } from './shared/masterpage/masterpage';
import { AlertListComponent} from './alerts/alert-list';
import { AlertDetailLocationComponent } from './alerts/alert-detail-location';
import { AlertDetailComponent } from './alerts/alert-detail';
import { AlertDetailChargeBackComponent } from './alerts/alert-detail-chargeback';

import { JobLogListComponent } from './log/job-log-list';
import { LocationListComponent } from './location/location-list';
import { LocationDetailComponent } from './location/location-detail';
import { LocationChargeBackComponent } from './location/location-chargeback';
import { JobParametersListComponent } from './jobparameters/jobparameters-list';
import { ReportListComponent } from './reports/reports-list';
import { CasesListComponent } from './cases/cases-list';
import { AddLocationComponent } from './location/add-location';
import { AddEditReturnComponent } from "./location/add-edit-return";
import { AddEditTheftComponent } from "./location/add-edit-theft";

/*************************************************************Directives/dto*******************************************************************/
import { CanActivateGuard } from "./app.authguard"; 
import { PasswordValidator } from './changePassword/changePassword.directive';
import { AddEditDisbursementComponent } from "./location/add-edit-disbursement";
import { DcrReconcilesListComponent } from "./dcrreconcile/dcr-reconcile";
import { DcrCreditReconcilesListComponent } from "./dcrreconcile/dcr-credit-reconcile";
import { DcrReconcilesOtherTransactionsComponent } from "./dcrreconcile/dcr-other-trans";
import { AccountManagementComponent } from "./accounts/accounts-management";
import { LocationDetailLiteComponent } from "./accounts/location-detail-lite";
import { DcrBankUnmatchedAllComponent } from "./dcrreconcile/dcr-bank-unmatched-all";
import { DcrUnmatchedAllComponent } from "./dcrreconcile/dcr-unmatched-all";
 

@NgModule({
    imports: [BrowserAnimationsModule, BrowserModule, routing, HttpModule, JsonpModule, FormsModule, Ng2PaginationModule, Ng2PageScrollModule.forRoot(), NgbModule.forRoot(), WVDatepickerModule.forRoot(), DateValueAccessorModule,
        DataTableModule, GrowlModule, DropdownModule, CalendarModule, ConfirmDialogModule, DialogModule, EditorModule, SharedModule, InputMaskModule, CurrencyMaskModule, FileUploadModule, TabsModule.forRoot(), ModalModule.forRoot(),
        SelectButtonModule, DndModule.forRoot()],
    declarations: [
        AppComponent, FormatProfitLossPipe, SafePipe, MomentPipe, MomentUtcPipe, FormatDatePipe, HeaderComponent, ImageCropperComponent, AlertDetailChargeBackComponent,
        MasterPageComponent, AlertListComponent, AlertDetailLocationComponent, AlertDetailComponent, LocationChargeBackComponent,
        LoginComponent, ResetPasswordComponent, ChangePasswordComponent, LocationDetailComponent, JobParametersListComponent,
        PasswordValidator, FileUploadComponent, DashboardMainComponent, JobLogListComponent, LocationListComponent, ReportListComponent,
        CasesListComponent, AddLocationComponent, AddEditReturnComponent, AddEditDisbursementComponent, AddEditTheftComponent,
        DcrReconcilesListComponent, DcrCreditReconcilesListComponent, DcrReconcilesOtherTransactionsComponent, AccountManagementComponent,
        LocationDetailLiteComponent, DcrBankUnmatchedAllComponent, DcrUnmatchedAllComponent
       ],

    entryComponents: [AddEditReturnComponent, AddEditDisbursementComponent, AddEditTheftComponent],

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
        Constants, CanActivateGuard, 
        AlertService, LookupService,
        NgbModalRef]
})

export class AppModule { }
 