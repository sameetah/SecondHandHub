import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';

@Pipe({
    name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: Date | string): string {
        const time = new Date(value);
        return formatDistanceToNowStrict(time, { addSuffix: true });
    }
}
