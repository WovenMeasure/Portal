import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "../common/services/logger-service";
import { ProxyService } from "../common/services/proxy-service";
import { Constants } from "../common/constants";
import { ContextService } from "../common/services/context-service";
import "../rxjs-operators"
 
@Injectable() 
export class AlertService {
    constructor(private proxyService: ProxyService,
        private contextService: ContextService,
        private constants: Constants)
    {
        this.currentAlertType = this.constants.AlertTypes.filter(a => { return a.constant == "LOC" })[0];
    }


    _currentAlertType: any;

    public get currentAlertType(): any {
        return this._currentAlertType;
    }

    public set currentAlertType(value: any) {
        this._currentAlertType = value;
    }


    public loadAlerts(): Observable<any> {
        let observable$ = this.proxyService.Get("alert/all/" + this.currentAlertType.alertTypeID);
        return observable$;
    }

    public loadAlertDetail(alertId: string): Observable<any> {
        let observable$ = this.proxyService.Get("alert/detail/" + alertId);
        return observable$;
    }
   
}