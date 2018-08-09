import { Component, OnInit, ViewChild } from '@angular/core';
import { Encounter } from '../../encounter/model/encounter';
import { DataService } from '../../data.service';
import { EditEncounterComponent } from '../../encounter/components/edit-encounter/edit-encounter.component';
import { Router } from '@angular/router';

const CardSizes = ['small', 'regular']

@Component({
  selector: 'app-encounters-tab',
  templateUrl: './encounters-tab.component.html',
  styleUrls: ['./encounters-tab.component.css']
})
export class EncountersTabComponent implements OnInit {
  @ViewChild('encounterEdit') encounterEdit: EditEncounterComponent


  edit = false
  selected: Encounter
  filter: string
  filtered: Encounter[] = []
  all: Encounter[] = []
  cardSize = CardSizes[0]
  round = 1
  turn: string

  constructor(private data: DataService, private router: Router) {
    this.data.encounters.subscribe(encounters => {
      this.all = encounters
      this.applyFilter()
    })

  }

  ff() {
    this.round += 1
  }
  fr() {
    this.round -= 1
    if (this.round <= 0) {
      this.round = 1
    }
  }
  nextTurn() {
    if (this.turn == this.selected.characters[this.selected.characters.length - 1]) {
      this.turn = this.selected.characters[0]
      this.ff()
    } else {
      let current = this.turn ? this.selected.characters.indexOf(this.turn) : -1
      this.turn = this.selected.characters[current + 1]
    }
  }

  prevTurn() {
    if (this.turn == this.selected.characters[0]) {
      if (this.round > 1) {
        this.turn = this.selected.characters[this.selected.characters.length - 1]
        this.fr()
      }
    } else {
      if (this.turn) {
        let current = this.selected.characters.indexOf(this.turn)
        this.turn = this.selected.characters[current - 1]
      }
    }
  }

  ngOnInit() {
  }

  updateFilter(filterText) {
    this.filter = filterText
    this.applyFilter()
  }

  applyFilter() {
    if (this.filter && this.filter.length > 0) {
      this.filtered = this.all.filter(item => item.name.toLowerCase().includes(this.filter.toLowerCase()))
    } else {
      this.filtered = this.all
    }
  }

  newEncounter() {
    const e = new Encounter()
    e.id = 'TEMP'
    e.name = "New Encounter"
    this.selected = e
    this.edit = true
  }

  save() {
    this.encounterEdit.save()
    this.edit = false
  }

  cancel() {
    this.edit = false
  }

  close() {
    this.selected = undefined
    this.edit = false
  }

  delete() {

  }

  openMap() {
    let opts: any = {}
    if (this.selected.zoom) {
      opts.zoom = this.selected.zoom
    }
    if (this.selected.x && this.selected.y) {
      opts.coords = this.selected.y + "," + this.selected.x
    }
    this.router.navigate(["/map/" + this.selected.map, opts])
  }

  toggleCardSize() {
    let i = CardSizes.findIndex(size => size == this.cardSize)
    if (i < 0 || i >= CardSizes.length - 1) {
      this.cardSize = CardSizes[0]
    } else[
      this.cardSize = CardSizes[++i]
    ]
  }

  select(item: Encounter) {
    this.selected = item
  }

  startEdit() {
    if (this.selected) {
      this.edit = true
    }
  }
}
