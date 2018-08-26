import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-restricted-content',
  templateUrl: './restricted-content.component.html',
  styleUrls: ['./restricted-content.component.css']
})
export class RestrictedContentComponent implements OnInit {
  @Input() item 
  @Input() field
  @Input() mode : 'mask' | 'hide' = 'hide'

  constructor(private data : DataService) { }

  ngOnInit() {

  }

  canView() : boolean {
    if (this.field) {
      return this.data.canViewField(this.item, this.field)
    }
    return true
  }
}
