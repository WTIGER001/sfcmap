import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'keepUrl'
})
export class KeepUrlPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }

  constructor(private sanitizer: DomSanitizer) { }

  transform(url) : SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
