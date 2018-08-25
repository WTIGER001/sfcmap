import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CharacterType, Character } from '../../../models';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-character-type-combo',
  templateUrl: './character-type-combo.component.html',
  styleUrls: ['./character-type-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: CharacterTypeComboComponent, multi: true }
  ]
})
export class CharacterTypeComboComponent implements ControlValueAccessor {
  selected: CharacterType
  mk: Character
  private innerValue: string
  private changed = [];
  private touched = [];
  private disabled: boolean;

  all: CharacterType[] = []
  options = []

  constructor(private data: DataService) {

  }

  @Input() set character(m: Character) {
    this.mk = m
    this.innerValue = m.type
    this.refresh()
  }

  get marker(): Character {
    return this.mk
  }

  onTextChange($event) {
    console.log($event);
    this.value = event.target['value']
  }

  refresh() {
    this.data.gameAssets.characterTypes.items$
      .subscribe(v => {
        this.all = v
        if (this.innerValue) {
          this.selected = this.all.find(mg => mg.id == this.innerValue)
        }
      })
  }

  name(): string {
    if (this.selected) {
      return this.selected.name
    } else if (this.innerValue) {
      let item = this.all.find(mg => mg.id == this.innerValue)
      if (item) {
        return item.name
      }
      return this.innerValue
    }
    return ''
  }

  select(type: CharacterType) {
    this.value = type.id
    this.selected = type
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.refresh()
      this.changed.forEach(f => f(value));
    }
  }

  registerOnChange(fn: any): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: any): void {
    this.touched.push(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: string): void {
    console.log(obj);
    this.innerValue = obj;
    this.refresh()
  }
}
