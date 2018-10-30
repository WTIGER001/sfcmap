import { Component, OnInit, Input } from '@angular/core';
import { Detector } from '../../detection-manager';

@Component({
  selector: 'app-detector-edit',
  templateUrl: './detector-edit.component.html',
  styleUrls: ['./detector-edit.component.css']
})
export class DetectorEditComponent implements OnInit {
  @Input() item : Detector

  constructor() { }

  ngOnInit() {
  }

  ok() {

  }

  cancel() {

  }
  
}
