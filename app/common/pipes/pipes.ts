import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as moment from 'moment';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(style) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
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
