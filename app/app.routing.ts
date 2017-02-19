/// <reference path="../typings/index.d.ts" />
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login';
import { ChangePasswordComponent } from './changePassword/changePassword';
import { ResetPasswordComponent } from './resetPassword/resetPassword';
import { DashboardMainComponent } from './dashboard/dashboard-main';
import { MasterPageComponent } from './shared/masterpage/masterpage';
import { CanActivateGuard } from './app.authguard';


const appRoutes: Routes = [
    { path: '', component: MasterPageComponent, canActivate: [CanActivateGuard],
        children: 
        [
            { path: '', redirectTo: 'dash-main', pathMatch: 'full' },
            { path: 'dash-main', component: DashboardMainComponent, canActivate: [CanActivateGuard] }       
        ]
    },
    { path: 'login', component: LoginComponent},
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'changePassword', component: ChangePasswordComponent }   
];
 
export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
