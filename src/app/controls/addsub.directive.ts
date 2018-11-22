import { Directive, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[addsub]'
})
export class AddsubDirective {
  private myval: string
  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }


  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;

    let chrs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-']
    if (chrs.indexOf(e.key) >= 0) {

    } else if (e.keyCode == 13) {
      e.preventDefault()
      this.el.blur()
      return;
    } else {
      e.preventDefault()
      e.stopPropagation()
      return;
    }
  }
}
