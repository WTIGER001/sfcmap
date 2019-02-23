import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Item } from 'ngx-ui-scroll/src/component/classes/item';
import { LangUtil } from 'src/app/util/LangUtil';
import { TokenBar } from 'src/app/models';

@Component({
  selector: 'app-picture-tile',
  templateUrl: './picture-tile.component.html',
  styleUrls: ['./picture-tile.component.css']
})
export class PictureTileComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('figure') figure : ElementRef
  @Input() item : any
  @Input() picture : string
  @Input() caption : string
  @Input() badge : string
  @Input() size : 'tiny' | 'small' | 'large'  | 'square-sm' | "none" = 'small'
  @Input() missing: string = './assets/missing.png'
  @Input() selected : boolean = false;
  @Input() checked : boolean = false;
  @Input() checkIcon : string = "check"
  @Input() canCheck : boolean = false
  @Input() objPos : number = 5
  @Input() x = true
  @Output() checkChange = new EventEmitter;
  @Output() change = new EventEmitter;
  @Input() zoom = 1
  @Input() crossedout = false

  // @Input() barPercentage = 1
  // @Input() showBar : boolean = false
  @Input() flyHeight = 0
  @Input() bars : TokenBar[] = []

  observer: MutationObserver
  constructor(public elRef: ElementRef) { 

  }



  getFontSize() {
    return 
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const config = { attributes: true, childList: false, subtree: false };
    this.observer = new MutationObserver(this.updateAfterMutation);
    this.observer.observe(this.figure.nativeElement, config)
  }

  ngOnDestroy()  {
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  calcBarWidth(bar : TokenBar) {
    if (this.figure) {
      const total = this.figure.nativeElement.offsetWidth-6
      const perc = bar.value / bar.max
      const barWidth = Math.floor(total * perc)
      return barWidth + "px"
    } 
    return '10px'
  }

  getColor(bar : TokenBar) {
    const warnColor = bar.warnColor || bar.color
    const perc = bar.value / bar.max
    if (bar.warnRange < 1 ) {
      return bar.warnRange < perc ? bar.color : warnColor
    } 
    return bar.warnRange < bar.value ? bar.color : warnColor
  }

  updateAfterMutation(mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-width') {
        this.updateSize()
      }
    }
  }

  updateSize() {
    const size = this.figure.nativeElement.offsetWidth
    if (size > 100) {
      this.figure.nativeElement.dataset.size = 'small'
    } else {
      this.figure.nativeElement.dataset.size = 'normal'
    }
  }

  widthChanged(elem) {
      return elem.offsetWidth !== parseInt(elem.dataset.width);
  }

  getSizeClass() {
    return this.size+"-pic"
  }
  getPicture() : string {
    if (this.picture) {
      return this.picture
    }
    if (this.item) {
      if (this.size == 'small') {
        return LangUtil.firstDefined(this.item.thumb, this.item.image, this.item.picture, this.item.token, this.missing)
      } else{
        return LangUtil.firstDefined(this.item.picture, this.item.image, this.item.thumb, this.item.token, this.missing)
      }
    }
    return this.missing

  }

  isChecked() {
    return this.checked;
  }

  getImagePosClass() {
    if (this.objPos && this.objPos > 0) {
      return "object-position-" + this.objPos
    }
      return "object-position-5" 
  }

  toggleCheck() {
    if (this.canCheck) {
    this.checked = !this.checked
    this.checkChange.emit(this.checked)
    this.change.emit(this.checked)
    }
  }

}
