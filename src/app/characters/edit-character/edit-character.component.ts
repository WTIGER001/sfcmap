import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-character',
  templateUrl: './edit-character.component.html',
  styleUrls: ['./edit-character.component.css']
})
export class EditCharacterComponent implements OnInit {

  edit = false
  character = new Character()

  constructor(private data: DataService, private route: ActivatedRoute) {
    this.character.name = 'HI'
    this.character.id = 'TEMP'
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.characters.subscribe(all => {
          let chr = all.find(c => c.id == id)
          if (chr) {
            this.character = chr
          }
        })
      }
    })
  }

  save() {
    this.data.save(this.character)
    this.edit = true
  }

  cancel() {
    this.edit = false;
  }

  startEdit() {
    this.edit = true
  }

  delete() {

  }
}
