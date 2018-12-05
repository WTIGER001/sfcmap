import { Component, OnInit } from '@angular/core';
import { mergeMap, tap } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { Annotation, MapConfig, Selection, TokenAnnotation } from 'src/app/models';
import { MapService } from '../../map.service';

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
  encounter: Encounter
  items: TokenRecord[] = []
  all: TokenRecord[] = []
  cfg: MapConfig
  expanded = true
  sel: Selection = new Selection([])
  tmap = new Map<TokenRecord, TokenAnnotation>()

  constructor(private data: DataService, private mapSvc: MapService) { }

  ngOnInit() {
    this.mapSvc.selection.subscribe(sel => {
      this.sel = sel
    })

    // Listen for changes to the map id
    this.mapSvc.mapConfig.pipe(
      tap(cfg => this.cfg = cfg),
      mergeMap(cfg => this.data.getActiveEncounter$(cfg.owner, cfg.id)),
      tap(enc => this.encounter = enc),
      tap(enc => this.prepareEnc())
    ).subscribe()

    this.mapSvc.annotationAddUpate.subscribe( a=> {
      this.prepareEnc()
    })
    this.mapSvc.annotationDelete.subscribe(a => {
      this.prepareEnc()
    })

  }

  prepareEnc() {
    if (this.encounter) {
      this.items = []
      this.all = this.encounter.participants.sort((a, b) => b.initiative - a.initiative)
      this.all.forEach(record => {
        const t = this.findToken(record)
        if (t) {
          this.tmap.set(record, t)
          this.items.push(record)
        }
      })
    }
  }

  isDead(item) : boolean {
   return  this.tmap.get(item).dead
  }

  pic(item) {
    return this.tmap.get(item).url
  }

  caption(item) {
    return this.tmap.get(item).name
  }

  select(item: TokenRecord) {
    const ta: TokenAnnotation = this.tmap.get(item)
    if (ta) {
      this.mapSvc.select(ta)
    }
  }

  isSelected(item) {
    if (!this.sel.isEmpty()) {
      const ta: TokenAnnotation = this.tmap.get(item)
      return (this.sel.items.find(i => i.id == ta.id) != undefined)
    }
    return false
  }

  toggle() {
    this.expanded = !this.expanded
  }

  isMyTurn(item: TokenRecord): boolean {
    const turn = this.encounter.turn
    const index = this.items.indexOf(item)
    const result = index == turn
    return result
  }

  nextTurn() {
    let a = { round: this.encounter.round, turn: this.encounter.turn }
    for (let i = 0; i < this.items.length; i++) {
      a = this.proposeNext(a.round, a.turn)
      const ta = this.tmap.get(this.items[a.turn])
      if (!ta.dead) {
        this.encounter.round = a.round
        this.encounter.turn = a.turn
        break;
      }
    }
    this.data.activateEncounter(this.encounter)
  }

  proposeNext(r: number, t: number): { round, turn } {
    let nextT = t + 1
    let nextR = r
    if (nextT < this.items.length) {
      return { round: nextR, turn: nextT }
    } else {
      return { round: nextR + 1, turn: 0 }
    }
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
        if (token && token.id == item.id) {
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

  dblclick(item) {
    if (item !== undefined) {
      const t = this.tmap.get(item)
      if (t) {
        this.mapSvc.panTo(t.center())
      }
    }
  }

}
