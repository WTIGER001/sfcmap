import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attr-value',
  templateUrl: './attr-value.component.html',
  styleUrls: ['./attr-value.component.css']
})
export class AttrValueComponent implements OnInit {
  @Input() type = "heart"
  @Input() value = 100
  @Input() size = '4x'

  constructor() { }

  ngOnInit() {
  }

}
