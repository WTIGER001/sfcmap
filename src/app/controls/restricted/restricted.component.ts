import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-restricted',
  templateUrl: './restricted.component.html',
  styleUrls: ['./restricted.component.css']
})
export class RestrictedComponent implements OnInit {
  @Input() item
  @Input() field
  @Input() mode: 'mask' | 'hide' = 'hide'
  @Input() value : string

  constructor(private data: DataService) { }

  ngOnInit() {

  }

  canView(): boolean {
    if (this.field) {
      return this.data.canViewField(this.item, this.field)
    }
    return true
  }
}