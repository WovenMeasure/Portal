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

        var momentObj = moment.utc(input);
        return momentObj[momentFn].apply(momentObj, args);
    }
}


/*
We have dates in the system 
*/
@Pipe({ name: 'momentUtc' })
export class MomentUtcPipe implements PipeTransform {
    transform(input: Date, momentFn: string): string {
        if (!input)
            return '';

        var args = Array.prototype.slice.call(arguments, 2);

        var momentObj = moment(input);
        return momentObj[momentFn].apply(momentObj, args);
    }
}

