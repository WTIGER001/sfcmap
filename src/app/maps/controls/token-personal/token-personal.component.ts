import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TokenAnnotation, Vision, TokenSize } from 'src/app/models';
import { AuraVisible } from 'src/app/models/aura';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-token-personal',
  templateUrl: './token-personal.component.html',
  styleUrls: ['./token-personal.component.css']
})
export class TokenPersonalComponent implements OnInit {

  @Input() item : TokenAnnotation
  @Output() changes = new EventEmitter()
  sizes : TokenSize[] = []
  constructor(private data : DataService) {
    this.sizes = this.data.pathfinder.sizes
   }

  ngOnInit() {
    if (this.item && !this.item.vision) { 
      this.item.vision = new Vision()
    }
  }

  updateShowName(value : AuraVisible) {
    this.item.showName = value
    this.update()
  }
  updateShowSpeed(value: AuraVisible) {
    this.item.showSpeed = value
    this.update()
  }
  updateShowReach(value: AuraVisible) {
    this.item.showReach = value
    this.update()
  }
  updateShowFly(value: AuraVisible) {
    this.item.showFly = value
    this.update()
  }

  update() {
    this.changes.emit()
  }


}
