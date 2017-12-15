import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "./logger-service";
import { ProxyService } from "./proxy-service";
import { Constants } from "../constants";
import { ContextService } from "./context-service";
 
@Injectable() 
export class LookupService {
    constructor(private proxyService: ProxyService,
        private contextService: ContextService,
        private constants: Constants)
    {
    }

    public loadRegions(): Observable<any> {
        let observable$ = this.proxyService.Get("lookup/region");
        return observable$;
    }

    public loadBankAccounts(): Observable<any> {
        let observable$ = this.proxyService.Get("lookup/bankAccounts");
        return observable$;
    }


    public loadBankAccountsUnmatched(): Observable<any> {
        let observable$ = this.proxyService.Get("lookup/bankAccountsUnMatched");
        return observable$;
    }


    public loadBankAccountsUnmatchedDcr(): Observable<any> {
        let observable$ = this.proxyService.Get("lookup/bankAccountsUnMatchedDcr");
        return observable$;
    }
}