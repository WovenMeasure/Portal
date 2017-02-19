import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { ProxyService } from "../common/services/proxy-service";
import { ContextService } from "../common/services/context-service";
import { LoggerService } from "../common/services/logger-service";

@Injectable()
export class ChangePasswordService {
    constructor(private loggerService: LoggerService, private proxyService: ProxyService, private http: Http, private contextService: ContextService) { }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        this.loggerService.logMessage(errMsg);

        return Observable.throw(errMsg);
    }

    public changePassword(email: string, password: string, token: string): Observable<any> {
        let observable$ = this.proxyService.PostAnonymous("account/updatePassword", { Email: email, NewPassword: password, PasswordResetToken: token });
        observable$.subscribe(
            data => {
                if (data.success) {

                }
            });
        return observable$;
    }

}