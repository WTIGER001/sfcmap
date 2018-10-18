import { Component, OnInit, Input } from '@angular/core';
import { Encounter } from '../../model/encounter';
import { Character } from '../../../models';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { SortablejsOptions } from 'angular-sortablejs/dist';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {
  @Input() selected: Encounter
  @Input() turn: string
  @Input() cardSize: string = "regular"
  characters: Character[] = []
  dragBefore = false
  dragAfter = false
  target: string

  sortOptions: SortablejsOptions = {
    group: "encounter",
    onEnd: this.save.bind(this),
    onRemove: this.save.bind(this),
    animation: 150,
    onUpdate: this.save.bind(this)
  };

  constructor(private data: DataService, private router: Router) {
    data.gameAssets.characters.items$.subscribe(chrs => this.characters = chrs)
  }

  ngOnInit() {
  }

  lookup(id: string): Character {
    return this.characters.find(c => c.id == id)
  }

  openCharacter(c: Character) {
    this.router.navigate(['/character/' + c])
  }

  save($event: any) {
    // console.log("Saving, $event, ", this.selected.characters, $event);
    this.data.save(this.selected)
  }

  addCharacter($event) {
    // this.selected.characters.push($event.id)
  }
}
