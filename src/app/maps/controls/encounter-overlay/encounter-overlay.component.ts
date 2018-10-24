import { Component, OnInit } from '@angular/core';
import { MapService } from '../../map.service';
import { DataService } from 'src/app/data.service';
import { tap, mergeMap } from 'rxjs/operators';
import { MapConfig, TokenAnnotation, Annotation, Selection } from 'src/app/models';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { ImageUtil } from 'src/app/util/ImageUtil';

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

      this.checkAllDead()
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
    let a = { round: this.encounter.round, turn: this.encounter.turn}
    for (let i=0; i< this.items.length; i++) {
      a = this.proposeNext(a.round,a.turn)
      if (!this.items[a.turn].dead ) {
        this.encounter.round = a.round
        this.encounter.turn = a.turn
        break;
      } 
    }
    this.data.activateEncounter(this.encounter)
  }

  proposeNext(r: number, t : number ) : {round, turn} {
    let nextT = t + 1
    let nextR = r
    if (nextT < this.items.length) {
      return {round: nextR, turn: nextT}
    } else {
      return {round: nextR+1, turn:0}
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

  dblclick(item) {
    if (item !== undefined) {
      const t = this.findToken(item)
      if (t) {
        this.mapSvc.panTo(t.center())
      }
    }
  }

  checkAllDead() {
    this.items.forEach(item => {
      this.checkDead(item)
    })
  }

  async checkDead(r : TokenRecord) {
    const t = this.findToken(r)
    if (t) {
      if (t.dead != r.dead) {
        t.setDead(r.dead);
        this.data.save(t)
      }
     
      // const l = t.getAttachment()
      // if (r.dead) {
      //   console.log("Making Dead Image", t.url)
      //   const deadImg = await ImageUtil.MarkX(t.url)
      //   console.log("MADE Dead Image", deadImg)
      //   l._image.src = deadImg
      // } else {
      //   l._image.src = r.token
      // }
    }
  }
}
