import { Component, OnInit ,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {
  @Input() icon : string
  @Input() message: string
  @Input() title : string
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
