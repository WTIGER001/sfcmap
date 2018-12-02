import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';
import { TokenBar, TokenAnnotation } from 'src/app/models/annotations';
import { LangUtil } from 'src/app/util/LangUtil';
import { Assets } from 'src/app/assets';

@Component({
  selector: 'app-token-icon',
  templateUrl: './token-icon.component.html',
  styleUrls: ['./token-icon.component.css']
})
export class TokenIconComponent implements OnInit {
  @ViewChild('figure') figure: ElementRef
  @Input() item: TokenAnnotation
  @Input() selected: boolean
  @Input() showName: boolean = true
  @Output() hover = new EventEmitter<boolean>()

  barheight = '3px'
  observer: MutationObserver

  constructor(public elRef: ElementRef, private zone : NgZone) {
  
  }

  calcBarHeight() {
    const h = this.elRef.nativeElement.offsetHeight 
    return h / 10 + "px"
  }

  calcBarGap() {
    const h = this.elRef.nativeElement.offsetHeight
    return h / 100 * 3 + "px"
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const config = { attributes: true, childList: false, subtree: false };
    this.observer = new MutationObserver((mutationsList, observer) => {
      for (var mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          this.updateSize()
        }
      }})
    this.observer.observe(this.elRef.nativeElement, config)
    
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  calcBarWidth(bar: TokenBar) {
    if (this.elRef) {
      const total = this.elRef.nativeElement.offsetWidth - 6
      const perc = bar.value / bar.max
      const barWidth = Math.floor(total * perc)
      return barWidth + "px"
    }
    return '10px'
  }

  calcFontSize(factor ?: number) {
    const f = factor || 0.14
    if (this.elRef) {
     return (this.elRef.nativeElement.offsetHeight * f)  + 'px'
    }
    return '10px';
  }

  getColor(bar: TokenBar) {
    const warnColor = bar.warnColor || bar.color
    const perc = bar.value / bar.max
    if (bar.warnRange < 1) {
      return bar.warnRange < perc ? bar.color : warnColor
    }
    return bar.warnRange < bar.value ? bar.color : warnColor
  }

  updateSize() {
    // console.log("Size changed... Updating", NgZone.isInAngularZone())
    const size = this.elRef.nativeElement.offsetWidth
    const hsize = this.elRef.nativeElement.offsetHeight
    if (size < 60) {
      this.figure.nativeElement.dataset.size = 'small'
    } else {
      this.figure.nativeElement.dataset.size = 'normal'
    }
  }

  widthChanged(elem) {
    return elem.offsetWidth !== parseInt(elem.dataset.width);
  }

  getPicture(): string {
    if (this.item) {
      return LangUtil.firstDefined(this.item.url, Assets.MissingPicture)
    }
    return Assets.MissingPicture
  }

  getImagePosClass() {
    if (this.item.imgPos) {
      return this.item.imgPos
    }
    return "object-position-5"
  }

  mouseenter() {
    this.hover.emit(true)
  }

  mouseleave() {
    this.hover.emit(false)
  }

}