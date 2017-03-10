import { Injectable } from '@angular/core';
import { ContextInfo } from "./context-info";
import {Message} from 'primeng/primeng';
@Injectable() 
export class ContextService {
    _contextInfo: ContextInfo;
    _loggedIn: boolean;
    public messages: Message[];

    constructor() {
        this.merchantId = "";
        this.messages = new Array<Message>();
        var userString = window.sessionStorage.getItem("contextInfo");
        if (userString == null) {
            this._contextInfo = new ContextInfo();
            this._loggedIn = false; 
        }
        else {
            this._contextInfo = JSON.parse(userString);
            this._loggedIn = true;
        }
    }

    public Clear() {
        window.sessionStorage.removeItem("contextInfo");
        this._contextInfo = new ContextInfo();
        this._loggedIn = false;
    }

    public get ContextInfo(): ContextInfo {
        return this._contextInfo;
    }

    public get LoggedIn(): boolean {
        return this._loggedIn;
    }

    public set LoggedIn(value) {
        if (value)
            window.sessionStorage.setItem("contextInfo", JSON.stringify(this._contextInfo));
        else    
            window.sessionStorage.removeItem("contextInfo");

        this._loggedIn = value;
    }

    _currentSection: string;

    public get currentSection(): string {
        return this._currentSection;
    }

    public set currentSection(value: string) {
        this._currentSection = value;
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

}
