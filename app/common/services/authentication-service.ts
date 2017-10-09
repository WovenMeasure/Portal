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
        let observable$ = this.proxyService.PostAnonymousFormLogin("account/authenticate", email, password).share();
        observable$.subscribe(
            data => {
                this.contextService.ContextInfo.displayName = data.userName;
                this.contextService.ContextInfo.userId = data.id;
                this.contextService.ContextInfo.email = data.email;
                this.contextService.ContextInfo.token = data.access_token;
                this.contextService.ContextInfo.tokenExpires = data[".expires"];
                this.contextService.ContextInfo.claims = data["claims"];

                this.contextService.LoggedIn = true;
            },
            () => { }
           );
        return observable$;     
    }
    
    public Logoff() {
        this.contextService.Clear();
    }
   
}