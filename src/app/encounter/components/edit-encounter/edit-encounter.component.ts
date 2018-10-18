import { Component, OnInit, Input } from '@angular/core';
import { Encounter } from '../../model/encounter';
import { DataService } from '../../../data.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Character } from '../../../models';

@Component({
  selector: 'app-edit-encounter',
  templateUrl: './edit-encounter.component.html',
  styleUrls: ['./edit-encounter.component.css']
})
export class EditEncounterComponent implements OnInit {

  @Input() selected: Encounter

  characters: Character[] = []

  constructor(private data: DataService) {
    data.gameAssets.characters.items$.subscribe(a => this.characters = a)
    this.searchFor.bind(this)

    this.selected = new Encounter()
  }

  ngOnInit() {
  }

  save() {
    this.data.save(this.selected)
  }

  update() {

  }
  addCharacter($event) {
    console.log("addCharacter, ", $event);

    // this.selected.characters.push($event.item.character.id)
  }

  getCharacter(id: string) {
    return this.characters.find(c => c.id == id)
  }

  searchFor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.getResults(term))
    );

  resultFormatter = (x: FormatResult) => x.toText ? x.toText() : x;

  formatter = (x: FormatResult) => x.toText ? x.toText() : x;

  getResults(term: string): FormatResult[] {
    return this.characters
      .filter(c => c.name.toLowerCase().includes(term.toLowerCase()))
      // .filter(c => !this.selected.characters.includes(c.id))
      .slice(0, 30)
      .map(c => new FormatResult(c))
  }

}

class FormatResult {
  constructor(public character: Character) {
    this.id = character.id;
    this.name = character.name
  }

  id: string
  name: string
  toText(): string {
    return this.name
  }
}
