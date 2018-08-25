import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Character } from '../../../models';
import { DataService } from '../../../data.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-find-character',
  templateUrl: './find-character.component.html',
  styleUrls: ['./find-character.component.css']
})
export class FindCharacterComponent implements OnInit {
  @Output() selected = new EventEmitter()
  @Input() ignore: string[] = []
  @ViewChild('actionBox') textinput: ElementRef
  placeholder = "+ Add Character"
  txt: string

  characters: Character[] = []
  constructor(private data: DataService) {
    data.gameAssets.characters.items$.subscribe(a => this.characters = a)
    this.searchFor.bind(this)
  }

  ngOnInit() {
  }

  onblur() {
    console.log("ON BLUR");
    this.placeholder = "Enter the name of the character"
  }

  clear() {
    console.log("CLEARING");
    this.txt = ''
    this.textinput.nativeElement.value = ''
    this.placeholder = "+ Add Character"
  }

  addCharacter($event) {
    this.selected.emit($event.item.character)
    this.clear()

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
      .filter(c => !this.ignore.includes(c.id))
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
