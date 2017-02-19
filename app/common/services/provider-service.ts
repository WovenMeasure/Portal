import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { ProxyService } from "./proxy-service";
import { Provider, ProviderAppointmentTypes } from '../../dto/provider';


@Injectable()
export class ProviderService {

    _providers: Provider;
    _providerAppointmentType: ProviderAppointmentTypes
    allProviders: any[] = [];

    constructor(private proxyService: ProxyService) {

        this._providers = new Provider();
        this._providerAppointmentType = new ProviderAppointmentTypes();
    }

    public get Providers(): Provider {
        return this._providers;
    }

    public get ProviderAppointmentTypes(): ProviderAppointmentTypes {
        return this._providerAppointmentType;
    }

    public GetProviders(id: string): Observable<any> {

        let observable$ = this.proxyService.Post("message/GetMessageRecipientsList ", { UserId: id });
        observable$.subscribe(
            data => {
                if (data.success) {
                    this.allProviders = data.providerList;
                    console.log(this.allProviders.length);
                }
            });
        return observable$;
    }

    

    public GetSingleProvider(askedid: string) {
        let provider = new Provider();
        for (var i = 0; i < this.allProviders.length; i++) {
            if (this.allProviders[i].id == askedid) {
                provider.id = this.allProviders[i].id;
                provider.providerNumber = this.allProviders[i].providerNumber;
                provider.title = this.allProviders[i].title;
                provider.firstName = this.allProviders[i].firstName;
                provider.lastName = this.allProviders[i].lastName;
                provider.heroImageId = this.allProviders[i].heroImageId;
                provider.isGeneralCounselor = this.allProviders[i].isGeneralCounselor;
                provider.fullName = this.allProviders[i].fullName;
            }
        }
        return provider;       
    }

    
    /*
    GetRandomProvider(): Observable<Provider> {
      return Observable.create(observer => {
          this.proxyService.GetAnonymous("provider/random").subscribe(
              res => {
                  let provider = new Provider();
                  provider.firstName = res.firstName;
                  provider.lastName = res.lastName;
                  provider.heroImageId = res.heroImageId;
                  provider.providerNumber = res.providerNumber;
                  provider.title = res.title;
                  observer.next(provider);
                  observer.complete();
              }
          );
      });
    }
    */

    //get list of possible Recipients



}