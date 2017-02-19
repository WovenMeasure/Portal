//our root app component
import {Component} from '@angular/core';
import { ContextService } from '../../common/services/context-service';
import { LoggerService } from '../../common/services/logger-service';
import { SpinnerService } from '../../common/services/spinner-service';
import { ContextInfo } from '../../common/services/context-info';
 
@Component({
  selector: 'header',
  templateUrl: 'header.tmpl.html'
}) 

export class HeaderComponent{
    constructor(private loggerService: LoggerService, private contextService: ContextService,
        private spinnerService: SpinnerService) { }

    currentUser: ContextInfo;

    ngOnInit() {
        this.currentUser = this.contextService.ContextInfo;
    }
}