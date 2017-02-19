import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { LoggerService } from "../common/services/logger-service";

@Injectable()
export class LoginService {
    constructor(private loggerService: LoggerService,
                                private http: Http) { }
    
   
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        this.loggerService.logMessage(errMsg);

        return Observable.throw(errMsg);
    }
}