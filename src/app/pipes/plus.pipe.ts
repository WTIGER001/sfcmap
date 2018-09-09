import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'plus'
})
export class PlusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (isNumber(value)) {
      if (value >=0) {
        return "+" + value
      } else {
        return value
      }
    } else {
      return "+" + value
    }
  }

}
