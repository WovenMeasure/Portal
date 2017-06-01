import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "./logger-service";
import { SpinnerService } from "./spinner-service";
import { Constants } from "../constants";
import { ContextInfo } from "./context-info";
import { ContextService } from "./context-service";

@Injectable()
export class ProxyService {
    constructor(private constants: Constants, private http: Http, private loggerService: LoggerService, private contextService: ContextService, private spinnerService: SpinnerService) { }
    private baseUrl = this.constants.BaseApiUri;  // URL to web API

    private createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer ' + this.contextService.ContextInfo.token);
    }
    private createBasicHeader(headers: Headers) {
        headers.append('Accept', 'application/json, application/javascript');
    }

    private createConfig(): any{
        var config = {
            headers: {
                'Authorization': 'bearer ' + this.contextService.ContextInfo.token,
                'Accept': 'application/json, application/javascript'
            },
            attempts: 0,
            cache: false,
            timeout: 120000
        };
        return config;
    }


    private HandleError(error: any) {
        console.log("in proxy service log error");
        this.spinnerService.finishCurrentStatus();
        this.loggerService.logException(error);
        return (Observable.throw(error));
    }

    public GetAnonymous(url: string): Observable<any> {
        let headers = new Headers();
        this.createBasicHeader(headers);

        let observable = this.http.get(this.baseUrl + url, { headers: headers }).map(res => res.json()).catch((error) => { return this.HandleError(error);}).share(); //make 'em hot
        return observable;
    }

    public GetFullAnonymous(fullUrl: string): Observable<any> {
        let headers = new Headers();
        this.createBasicHeader(headers);

        let observable = this.http.get(fullUrl, { headers: headers }).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public PostAnonymousFormLogin(url: string, userName: string, password: string): Observable<any> {
        let body = new URLSearchParams();
        body.set('username', userName);
        body.set('password', password);
        body.set('rc', 'Laz:Audit-Portal');;
        body.set('grant_type', 'passwordAndClaim');
        let observable = this.http.post(this.baseUrl + url, body).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public PostAnonymous(url: string, data: any): Observable<any> {
        let headers = new Headers();
        this.createBasicHeader(headers);

        let observable = this.http.post(this.baseUrl + url, data, { headers: headers }).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public Get(url: string): Observable<any> {
        let observable = this.http.get(this.baseUrl + url, this.createConfig()).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public Post(url: string, data: any): Observable<any> {
        let observable = this.http.post(this.baseUrl + url, data, this.createConfig()).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public Put(url: string, data: any): Observable<any> {
        let observable = this.http.put(this.baseUrl + url, data, this.createConfig()).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

    public Delete(url: string): Observable<any> {
        let observable = this.http.delete(this.baseUrl + url, this.createConfig()).map(res => res.json()).catch((error) => { return this.HandleError(error); }).share(); //make 'em hot
        return observable;
    }

}