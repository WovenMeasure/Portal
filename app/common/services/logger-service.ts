import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
    logMessage(message: string) {
        console.log(message);
    }     

    logException(exception: any) {
        console.log(exception);
    }     
}