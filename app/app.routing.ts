/// <reference path="../typings/index.d.ts" />
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login';
import { ChangePasswordComponent } from './changePassword/changePassword';
import { ResetPasswordComponent } from './resetPassword/resetPassword';
import { DashboardMainComponent } from './dashboard/dashboard-main';
import { MasterPageComponent } from './shared/masterpage/masterpage';
import { CanActivateGuard } from './app.authguard';
import { MerchantListComponent} from './admin/merchants/merchant-list';
import { AlertListComponent} from './alerts/alert-list';
import { AlertDetailLocationComponent } from './alerts/alert-detail-location';
import { AlertDetailComponent } from './alerts/alert-detail';
import { JobLogListComponent } from './log/job-log-list';
import { LocationListComponent } from './location/location-list';
import { LocationDetailComponent } from './location/location-detail';

const appRoutes: Routes = [
    { path: '', component: MasterPageComponent, canActivate: [CanActivateGuard],
        children: 
        [
            { path: '', redirectTo: 'dash-main', pathMatch: 'full' },
            { path: 'dash-main', component: DashboardMainComponent, canActivate: [CanActivateGuard] },
            {
                path: 'location', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'location-list', component: LocationListComponent, canActivate: [CanActivateGuard] },
                    { path: 'location-detail', component: LocationDetailComponent, canActivate: [CanActivateGuard] }
                ]
            },
            {
                path: 'alert', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'alert-list', component: AlertListComponent, canActivate: [CanActivateGuard] },
                    { path: 'alert-detail-location', component: AlertDetailLocationComponent, canActivate: [CanActivateGuard] },
                    { path: 'alert-detail', component: AlertDetailComponent, canActivate: [CanActivateGuard] }
                ],
            },
            {
                path: 'log', component: null, canActivate: [CanActivateGuard], children:
                [
                    { path: 'job-log-list', component: JobLogListComponent, canActivate: [CanActivateGuard] }
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
