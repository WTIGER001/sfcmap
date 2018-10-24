import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Item } from 'ngx-ui-scroll/src/component/classes/item';
import { LangUtil } from 'src/app/util/LangUtil';

@Component({
  selector: 'app-picture-tile',
  templateUrl: './picture-tile.component.html',
  styleUrls: ['./picture-tile.component.css']
})
export class PictureTileComponent implements OnInit {
  @Input() item : any
  @Input() picture : string
  @Input() caption : string
  @Input() badge : string
  @Input() size : 'tiny' | 'small' | 'large'  | 'square-sm' = 'small'
  @Input() missing: string = './assets/missing.png'
  @Input() selected : boolean = false;
  @Input() checked : boolean = false;
  @Input() checkIcon : string = "check"
  @Input() canCheck : boolean = false
  @Input() objPos : number = 5
  @Input() x = true
  @Output() checkChange = new EventEmitter;
  
  constructor() { }

  ngOnInit() {
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
    }
  }

}
