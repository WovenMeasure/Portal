import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "../common/services/logger-service";
import { ProxyService } from "../common/services/proxy-service";
import { ContextService } from "../common/services/context-service";
import "../rxjs-operators"

@Injectable()
export class ResetPasswordService {
    constructor(private loggerService: LoggerService, private proxyService: ProxyService,
        private contextService: ContextService, private http: Http) { }


    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        this.loggerService.logMessage(errMsg);

        return Observable.throw(errMsg);
    }

    public resetPassword(email: string): Observable<any> {
        let observable$ = this.proxyService.PostAnonymous("account/sendResetPassword ", { Email: email });
        observable$.subscribe(
            data => {
                if (data.success) {
                }
            });
        return observable$;

    }

}