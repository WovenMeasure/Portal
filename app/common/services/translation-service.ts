import { Injectable, OnInit } from '@angular/core';
import { ProxyService } from "./proxy-service";
import { Observable }     from 'rxjs/Observable';
import { AsyncSubject }     from 'rxjs/AsyncSubject';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Injectable()
export class TranslationService {
    private _engine: any;

    constructor(private proxyService: ProxyService,
                private sanitizer: DomSanitizer) {
    }


    public init(): Promise<any> {
        var self = this;
        return new Promise<any>(function (resolve, reject) {
            let language: string = self.getFirstBrowserLanguage();
            if (language.indexOf('-') !== -1)
                language = language.split('-')[0];

            if (language.indexOf('_') !== -1)
                language = language.split('_')[0];

            console.log(language);
            let languageFilePath: string = 'app/translations/wellview-participantportal-' + language + '.js';
            let ssid: string = "id_" + language;
            if (sessionStorage) {
                if (sessionStorage.getItem(ssid)) {
                    self._engine = JSON.parse(sessionStorage.getItem(ssid));
                    return resolve(self._engine);
                }
                else {
                    self.proxyService.GetFullAnonymous(languageFilePath).map(res => res)
                        .subscribe(res => {
                            sessionStorage.setItem(ssid, JSON.stringify(res));
                            self._engine = res;
                            return resolve(self._engine);
                        });
                }
            }
            else {
                self.proxyService.GetFullAnonymous(languageFilePath).map(res => res)
                    .subscribe(res => {
                        sessionStorage.setItem(ssid, JSON.stringify(res));
                        self._engine = res;
                        return resolve(self._engine);
                    });
            }      
        });
    }

    private getFirstBrowserLanguage() {
        let nav: Navigator = window.navigator;
        let browserLanguagePropertyKeys: any = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
        let i: number = 0;
        let language: string = "";

        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
            language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                return language;
            }
        }

        return null;
    }

    public translate(key: string): string {
        return this._engine[key];
    }
}