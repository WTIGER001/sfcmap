import { Component, OnInit, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { CharacterType } from '../../../models/character-type';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-edit-character-type',
  templateUrl: './edit-character-type.component.html',
  styleUrls: ['./edit-character-type.component.css']
})
export class EditCharacterTypeComponent implements OnInit {
  @Input() selected: CharacterType

  constructor(private data: DataService) { }

  ngOnInit() {
  }

  save() {
    console.log("SAVING Character TYPE");
    if (this.selected) {
      if (this.selected.id == 'TEMP') {
        this.selected.id = UUID.UUID().toString()
      }
      let m = new CharacterType()
      m.id = this.selected.id
      m.name = this.selected.name
      m.order = this.selected.order

      this.data.save(m)
    }
  }
}
