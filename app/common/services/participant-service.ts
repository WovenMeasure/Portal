import {CredentialInfo} from "../../dto/participant-info";
import {ContactInfo} from "../../dto/participant-info";
import {InsuranceInfo} from "../../dto/participant-info";
import {TermsConditionInfo} from "../../dto/participant-info";
import {ParticipantContext} from "../../dto/participant-info";
import { Observable }     from 'rxjs/Observable';
import { ProxyService } from "./proxy-service";
import { Injectable } from '@angular/core';

@Injectable()
export class ParticipantService {
    _credential: CredentialInfo;
    _contact: ContactInfo;
    _insurance: InsuranceInfo;
    _participantContext: ParticipantContext;

    constructor(private proxyService: ProxyService) {
        this._credential = new CredentialInfo();
        this._contact = new ContactInfo();
        this._insurance = new InsuranceInfo();
        this._participantContext = new ParticipantContext();
        this._participantContext.contactLocalSave = false;
        this._participantContext.insuranceLocalSave = false;
        this._participantContext.hsaAssesmentComp = false;
        this._participantContext.checkUpComp = false;
        this._participantContext.triggerDashboardPop = false;
        this._participantContext.screeningScheduled = false;
        this._participantContext.userAvatar = "/app/images/UserNoImage.svg";
    }

    public get CredentialInfo(): CredentialInfo {
        return this._credential;
    }

    public get ContactInfo(): ContactInfo {
        return this._contact;
    }

    public get InsuranceInfo(): InsuranceInfo {
        return this._insurance;
    }

    public get ParticipantContext(): ParticipantContext {
        return this._participantContext;
    }
    
    
    public GetScreeningUrl(id: string): Observable<any> {
        let observable$ = this.proxyService.Post("user/GetSchedulingLink", { UserId: id }).share();       
        return observable$;
    }

    public HasScreeningScheduled(id: string): Observable<any> {
        let observable$ = this.proxyService.Post("user/HasScreeningScheduled", { UserId: id }).share();
        return observable$;
    }


    // if needed create get methods for contant, insurance, and term. But since participant-info is used only within account setup.
    //  We do not need this service.


}