import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-view-chr-attachments',
  templateUrl: './view-chr-attachments.component.html',
  styleUrls: ['./view-chr-attachments.component.css']
})
export class ViewChrAttachmentsComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
