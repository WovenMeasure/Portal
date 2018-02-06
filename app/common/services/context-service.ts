import { Injectable } from '@angular/core';
import { ContextInfo } from "./context-info";
import { Message } from 'primeng/primeng';
import * as moment from 'moment';

@Injectable() 
export class ContextService {
    public messages: Message[];

    constructor() {
        this.merchantId = "";
        this.messages = new Array<Message>();       
    }    

    public get ContextInfo(): any {
        var userString = window.localStorage.getItem("User");
        let contextInfo: any;
        if (userString == null) {
            contextInfo = new ContextInfo();
        }
        else {
            contextInfo = JSON.parse(userString);
        }

        return contextInfo;
    }

    public get LoggedIn(): boolean {
        return (window.localStorage.getItem('user') != null);
    }    

    _currentSection: string;

    public get currentSection(): string {
        return this._currentSection;
    }

    public set currentSection(value: string) {
        this._currentSection = value;
    }

    _alertFilterFromDate: Date = moment().subtract(2, 'months').toDate();

    public get currentAlertFilterFromDate(): Date {
        return this._alertFilterFromDate;
    }

    public set currentAlertFilterFromDate(value: Date) {
        this._alertFilterFromDate = value;
    }

    _alertFilterToDate: Date = moment().toDate();

    public get currentAlertFilterToDate(): Date {
        return this._alertFilterToDate;
    }

    public set currentAlertFilterToDate(value: Date) {
        this._alertFilterToDate = value;
    }

    _merchantId: string;

    public get merchantId(): string {
        return this._merchantId;
    }

    public set merchantId(value: string) {
        this._merchantId = value;
    }

    _merchantName: string;

    public get merchantName(): string {
        return this._merchantName;
    }

    public set merchantName(value: string) {
        this._merchantName = value;
    }

    public get currentTab(): string {
        return window.localStorage.getItem("currentTab");
    }

    public set currentTab(value: string) {
        window.localStorage.setItem("currentTab", value);
    }


    public getGridOption(key: string) {
        var option = window.localStorage.getItem(key);
        if (option)
            return JSON.parse(option);
    }

    public setGridOption(key: string, gridOption: any) {
        return window.localStorage.setItem(key, JSON.stringify(gridOption));
    }


    public get showInProgressOnly(): boolean {
        let val: string = window.localStorage.getItem("showInProgressOnly");
        if (null == val)
            return false;

        return val == 'true';
    }

    public set showInProgressOnly(value: boolean) {
        window.localStorage.setItem("showInProgressOnly", value.toString());
    }


    public get showResolved(): boolean {
        let val: string = window.localStorage.getItem("showResolved");
        if (null == val)
            return false;

        return val == 'true';
    }

    public set showResolved(value: boolean) {
        window.localStorage.setItem("showResolved", value.toString());
    }


    public get acctManagementSelectedAccount(): string {
        let val: string = window.localStorage.getItem("acctManagementSelectedAccount");
        if (null == val)
            return "";

        return val;
    }

    public set acctManagementSelectedAccount(value: string) {
        window.localStorage.setItem("acctManagementSelectedAccount", value);
    }




    public hasPermission(claimValue: string): boolean {
        let contextInfo: ContextInfo = this.ContextInfo;
        
        if (!this.ContextInfo.profile.custom_groups)
            return false;

        return (this.ContextInfo.profile.custom_groups.indexOf(claimValue) > 0);
    }

}
