import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "./logger-service";
import { ProxyService } from "./proxy-service";
import { ContextService } from "./context-service";
import { Constants } from "../constants";
import { ContextInfo } from "./context-info";
import "../../rxjs-operators"

@Injectable()    
export class AuthenticationService {
    constructor(private proxyService: ProxyService, private contextService: ContextService) { }

    public Login(email: string, password: string): Observable<any> {
        let observable$ = this.proxyService.PostAnonymous("account/authenticate", { Username: email, Password: password, RequiredClaimValue :"Admin" }).share();
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.contextService.ContextInfo.displayName = data.user.firstName;
                    this.contextService.ContextInfo.fullName = data.user.fullName;
                    this.contextService.ContextInfo.userId = data.user.id;
                    this.contextService.ContextInfo.email = data.user.email;
                    this.contextService.ContextInfo.token = data.token;
                    this.contextService.ContextInfo.tokenExpires = data.tokenExpirationDate;
                    this.contextService.LoggedIn = true;
                }
            });
        return observable$;     
    }

    public Login2FA(email: string, password: string): Observable<any> {
        let observable$ = this.proxyService.PostAnonymous("account/authenticateW2FA", { Username: email, Password: password, RequiredClaimValue: "Admin" }).share();      
        return observable$;
    }

    public LoginFinish2FA(userId: string, key2FA: string): Observable<any> {
        let observable$ = this.proxyService.PostAnonymous("account/authenticateCheck2FA", { UserId: userId, Key2FA: key2FA }).share();
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.contextService.ContextInfo.displayName = data.user.firstName;
                    this.contextService.ContextInfo.fullName = data.user.fullName;
                    this.contextService.ContextInfo.userId = data.user.id;
                    this.contextService.ContextInfo.email = data.user.email;
                    this.contextService.ContextInfo.token = data.token;
                    this.contextService.ContextInfo.tokenExpires = data.tokenExpirationDate;
                    this.contextService.LoggedIn = true;
                }
            });
        return observable$;
    }
  
    public Logoff() {
        this.contextService.Clear();
    }
   
}