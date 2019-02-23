import { Component, OnInit, Input } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { NewMapWizard } from '../NewMapWizard';

@Component({
  selector: 'app-new-map-wizard-information-pg',
  templateUrl: './new-map-wizard-information-pg.component.html',
  styleUrls: ['./new-map-wizard-information-pg.component.css']
})
export class NewMapWizardInformationPgComponent implements OnInit {
  @Input() map: MapConfig
  @Input() control : NewMapWizard

  constructor() { }

  ngOnInit() {
  }

  update() {
    this.control.canNext = this.canNext()
  }

  canNext() {
    return this.map.name != undefined && this.map.name.length >= 1
  }

}
