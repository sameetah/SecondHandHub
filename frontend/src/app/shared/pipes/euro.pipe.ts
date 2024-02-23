import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EUR'
})
export class EuroPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR'
    });
  }
}
