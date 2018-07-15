import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appViewbox]'
})
export class ViewboxDirective implements OnInit {
  @Input() viewvalue
  @Input() viewheight
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    console.log("Setting viewbox to ", this.viewvalue);
    this.el.nativeElement.setAttribute("viewBox", this.viewvalue)
    this.el.nativeElement.setAttribute("height", this.viewheight)
  }

}
