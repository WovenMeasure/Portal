import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    constructor(private _sanitizer: DomSanitizer) { }

    public transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this._sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this._sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this._sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this._sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this._sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Unable to bypass security for invalid type: ${type}`);
        }
    }
}


@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
    transform(input: Date, momentFn: string): string {
        if (!input)
            return '';

        var args = Array.prototype.slice.call(arguments, 2);
        var utcDateTime = moment.utc(input);
        var momentObj = utcDateTime.local();
        return momentObj[momentFn].apply(momentObj, args);
    }
}


@Pipe({ name: 'momentUtc' })
export class MomentUtcPipe implements PipeTransform {
    transform(input: Date, momentFn: string): string {
        if (!input)
            return '';

        var args = Array.prototype.slice.call(arguments, 2);
        var utcDateTime = moment.utc(input);
        return utcDateTime[momentFn].apply(utcDateTime, args);
    }
}


@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(value: string): any {
        if (value == '' || value == undefined)
            return '';

        var dateValue = new Date(value);
        var datewithouttimezone = new Date(dateValue.getUTCFullYear(),
                dateValue.getUTCMonth(),
                dateValue.getUTCDate(),
                dateValue.getUTCHours(),
                dateValue.getUTCMinutes(),
                dateValue.getUTCSeconds());
        return datewithouttimezone;
    }

}


@Pipe({ name: 'formatProfitLoss' })
export class FormatProfitLossPipe implements PipeTransform {
    transform(value: string): any {
        if (value == '' || value == undefined)
            return '';

        var numberValue = parseFloat(value.replace("$",""));
        if (numberValue < 0.0) {
            return "<font color='red'>(" + value + ")</font>";
        }
        return value;
    }

}
