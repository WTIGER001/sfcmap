import { Component, OnInit } from '@angular/core';
import { MapService } from '../../map.service';
import { DataService } from 'src/app/data.service';
import { tap, mergeMap } from 'rxjs/operators';
import { MapConfig, TokenAnnotation, Annotation, Selection } from 'src/app/models';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';

/**
 * This component is displayed as part of the map.
 */
@Component({
  selector: 'app-encounter-overlay',
  templateUrl: './encounter-overlay.component.html',
  styleUrls: ['./encounter-overlay.component.css']
})
export class EncounterOverlayComponent implements OnInit {
  /**
   * The active encounter for this map
   */
  encounter : Encounter
  items : TokenRecord[]
  cfg : MapConfig
  expanded = true
  sel: Selection = new Selection([])


  constructor(private data : DataService, private mapSvc : MapService) { }

  ngOnInit() {
    this.mapSvc.selection.subscribe(sel => {
      this.sel = sel
    })

    // Listen for changes to the map id
    this.mapSvc.mapConfig.pipe(
      tap( cfg => this.cfg = cfg),
      mergeMap( cfg => this.data.getActiveEncounter$(cfg.owner, cfg.id)),
      tap( enc => this.encounter = enc),
      tap( enc => this.prepareEnc())
    ).subscribe()

  }

  prepareEnc() {
    if (this.encounter) {
      // Sort according to initiative order
      this.items = this.encounter.participants.sort((a,b) => b.initiative - a.initiative)
    }
  }

  pic(item) {
    return item.token
  }

  caption(item) {
    return item.name
  }


  select(item: TokenRecord) {
    // Get the tokenAnnotation
    const ta: TokenAnnotation = this.findToken(item)
    if (ta) {
      this.mapSvc.select(ta)
    }
  }

  isSelected(item) {
    if (!this.sel.isEmpty()) {
      const ta: TokenAnnotation = this.findToken(item)
      return (this.sel.items.find(i => i.id == ta.id) != undefined)
    }
    return false
  }

  toggle() {
    this.expanded = !this.expanded
  }

  isMyTurn(item : TokenRecord) : boolean {
    const turn = this.encounter.turn
    const index = this.items.indexOf(item) 
    const result = index  == turn
    return result
  }

  nextTurn() {
    let next = this.encounter.turn + 1
    if (next < this.items.length) {
      this.encounter.turn = next
    } else {
      this.encounter.turn = 0;
      this.encounter.round += 1
    }
    this.data.activateEncounter(this.encounter)
  }
  nextRound() {
    this.encounter.turn = 0;
    this.encounter.round += 1
    this.data.activateEncounter(this.encounter)
  }

  isToken(l: any): boolean {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return true
    }
  }

  findToken(item: TokenRecord): TokenAnnotation {
    const map = this.mapSvc._map
    let rtn: TokenAnnotation
    map.eachLayer(l => {
      if (this.isToken(l)) {
        const token: TokenAnnotation = this.getItemFromLayer(l)
        if (token.itemId == item.id) {
          rtn = token
        }
      }
    })
    return rtn
  }

  getItemFromLayer(l: any): TokenAnnotation {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return annotation
    }
    return undefined
  }
}
