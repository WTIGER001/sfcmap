import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'keepStyle'
})
export class KeepStylePipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }

  constructor(private sanitizer: DomSanitizer) { }

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
