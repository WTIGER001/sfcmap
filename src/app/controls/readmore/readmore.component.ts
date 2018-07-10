import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-readmore',
  templateUrl: './readmore.component.html',
  styleUrls: ['./readmore.component.css']
})
export class ReadmoreComponent implements OnInit {
  @Input() maxLength: number = 100
  tolerance = 20
  boundries = [' ', '.', '-', ';']
  shorttext: string
  longtext: string
  trimmed = false
  expanded = false

  constructor() { }

  ngOnInit() {
    this.trim()
  }

  @Input()
  public set value(v: string) {
    this.longtext = v
    this.trim()
  }

  private trim() {
    this.expanded = false
    if (this.longtext && this.longtext.length > this.maxLength) {
      let num = this.maxLength
      while (!this.isBoundry(this.longtext.substr(num, 1))) {
        num -= 1
        if (this.maxLength - num > this.tolerance) {
          num = this.maxLength
          break;
        }
      }
      this.shorttext = this.longtext.substr(0, num)
      this.trimmed = true
    } else {
      this.trimmed = false
    }
  }

  private isBoundry(chr: string) {
    return this.boundries.includes(chr)
  }

  toggle() {
    this.expanded = !this.expanded
    console.log("Toggled! ", this.expanded);
  }
}
