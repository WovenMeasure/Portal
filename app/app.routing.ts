/// <reference path="../typings/index.d.ts" />
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login';
import { ChangePasswordComponent } from './changePassword/changePassword';
import { ResetPasswordComponent } from './resetPassword/resetPassword';
import { DashboardMainComponent } from './dashboard/dashboard-main';
import { MasterPageComponent } from './shared/masterpage/masterpage';
import { CanActivateGuard } from './app.authguard';
import { AlertListComponent} from './alerts/alert-list';
import { AlertDetailLocationComponent } from './alerts/alert-detail-location';
import { AlertDetailComponent } from './alerts/alert-detail';
import { AlertDetailChargeBackComponent } from './alerts/alert-detail-chargeback';
import { JobLogListComponent } from './log/job-log-list';
import { LocationListComponent } from './location/location-list';
import { AddLocationComponent } from './location/add-location';
import { LocationDetailComponent } from './location/location-detail';
import { LocationChargeBackComponent } from './location/location-chargeback';
import { JobParametersListComponent } from './jobparameters/jobparameters-list';
import { ReportListComponent } from './reports/reports-list';
import { CasesListComponent } from './cases/cases-list';
import { DcrReconcilesListComponent } from "./dcrreconcile/dcr-reconcile";

const appRoutes: Routes = [
    { path: '', component: MasterPageComponent, canActivate: [CanActivateGuard],
        children: 
        [
            { path: '', redirectTo: 'dash-main', pathMatch: 'full' },
            { path: 'dash-main', component: DashboardMainComponent, canActivate: [CanActivateGuard] },
            {
                path: 'location', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'add-location', component: AddLocationComponent, canActivate: [CanActivateGuard] },
                    { path: 'location-list', component: LocationListComponent, canActivate: [CanActivateGuard] },
                    { path: 'location-detail', component: LocationDetailComponent, canActivate: [CanActivateGuard] },
                    { path: 'location-chargeback', component: LocationChargeBackComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'alert', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'alert-list', component: AlertListComponent, canActivate: [CanActivateGuard] },
                    { path: 'alert-detail-location', component: AlertDetailLocationComponent, canActivate: [CanActivateGuard] },
                    { path: 'alert-detail', component: AlertDetailComponent, canActivate: [CanActivateGuard] },
                    { path: 'alert-detail-chargeback', component: AlertDetailChargeBackComponent, canActivate: [CanActivateGuard] }
                ],
            },
            {
                path: 'cases', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'cases-list', component: CasesListComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'dcr-reconcile', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'dcr-reconcile-list', component: DcrReconcilesListComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'log', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'job-log-list', component: JobLogListComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'jobparameter', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'job-parameter-list', component: JobParametersListComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'reports', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'report-list', component: ReportListComponent, canActivate: [CanActivateGuard] }
                ]
            }

        ]
    },
    { path: 'login', component: LoginComponent},
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'changePassword', component: ChangePasswordComponent }   
];
 
export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
