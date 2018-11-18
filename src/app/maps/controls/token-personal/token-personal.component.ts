import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TokenAnnotation, Vision } from 'src/app/models';

@Component({
  selector: 'app-token-personal',
  templateUrl: './token-personal.component.html',
  styleUrls: ['./token-personal.component.css']
})
export class TokenPersonalComponent implements OnInit {

  @Input() item : TokenAnnotation
  @Output() changes = new EventEmitter()

  constructor() { }

  ngOnInit() {
    if (this.item && !this.item.vision) { 
      this.item.vision = new Vision()
    }
  }



}
