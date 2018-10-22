import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Monster } from '../../monster';

@Component({
  selector: 'app-monster-view-core',
  templateUrl: './monster-view-core.component.html',
  styleUrls: ['./monster-view-core.component.css']
})
export class MonsterViewCoreComponent implements OnInit {
  @Input() item : Monster
  @Input() canEdit : boolean = true
  @Output() onCancel = new EventEmitter()
  @Input() showTools = true

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.onCancel.emit()
  }

  sentences(text: string): string[] {
    return text.split(".").map(item => item + ".")
  }

  specialAbilities(text: string): KeyValue[] {
    let items = text.split(".").map(item => item + ".")
    return items.map(item => {
      const indx = item.indexOf(")")
      if (indx > 0) {
        return new KeyValue(item.substring(0, indx), item.substr(indx))
      } else {
        return new KeyValue("UNK", item)
      }
    })
  }

  viewAny(...fields: string[]) {
    let yes = true
    // fields.forEach(f => {
    //   yes = yes && this.data.canViewField(this.monster, f)
    // })
    return yes
  }

}


export class KeyValue {
  constructor(public key: string, public value: string) { }
}
export class KeyValueNum {
  constructor(public key: string, public value: string, public num: number) { }
}
