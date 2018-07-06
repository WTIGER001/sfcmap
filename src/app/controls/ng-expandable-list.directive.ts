import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * The purpose of this directive is to create an expandable element on each 'child'. This directive is fully styleable, etc
 */
@Directive({
  selector: '[NgExpandableList]'
})
export class NgExpandableListDirective {

  constructor(private el: ElementRef) {


  }

  @HostListener('click') onMouseEnter() {

  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
