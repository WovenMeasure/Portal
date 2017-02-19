import * as moment from 'moment';


export class DateFormatter {
    public format(date: Date, format: string): string {
        var momentObj = moment(date);
        return momentObj.format(format);
    }
    
}
