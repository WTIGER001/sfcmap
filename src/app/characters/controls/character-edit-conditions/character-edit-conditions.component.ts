import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { Pathfinder } from 'src/app/models/gamesystems/pathfinder';
import { DataService } from 'src/app/data.service';
import { Character } from 'src/app/models';

@Component({
  selector: 'app-character-edit-conditions',
  templateUrl: './character-edit-conditions.component.html',
  styleUrls: ['./character-edit-conditions.component.css']
})
export class CharacterEditConditionsComponent implements OnInit, AfterContentInit {

  conditions = []
  @Input() character : Character
  constructor(private data : DataService) { 
    this.conditions = this.data.pathfinder.conditions
  }

  ngOnInit() {


  }

  ngAfterContentInit(): void {
    const charConditions = this.character.conditions ? this.character.conditions : {}
    const all = this.data.pathfinder.conditions.map(condition => {
      const enabled = charConditions[condition.name]
      return {
        "name" : condition.name,
        "description" : condition.description,
        "enabled" : enabled
      }
      
    })
    this.conditions = all
  }

}
