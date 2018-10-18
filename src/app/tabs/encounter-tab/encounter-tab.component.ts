import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DialogService } from 'src/app/dialogs/dialog.service';
import { MapService } from 'src/app/maps/map.service';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { UUID } from 'angular2-uuid';
import { Layer } from 'leaflet';
import { Character, Annotation, TokenAnnotation, Asset, Selection, Game, MapConfig } from 'src/app/models';
import { Token } from 'src/app/maps/token';
import { Monster } from 'src/app/monsters/monster';
import { LangUtil } from 'src/app/util/LangUtil';
import * as _ from 'lodash';
import { map, mergeMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-encounter-tab',
  templateUrl: './encounter-tab.component.html',
  styleUrls: ['./encounter-tab.component.css']
})
export class EncounterTabComponent implements OnInit {
  encounter: Encounter
  teams: string[]
  sel : Selection = new Selection([])
  game: Game
  mapCfg: MapConfig

  constructor(private data: DataService, private dialog: DialogService, private mapSvc: MapService) { }

  ngOnInit() {
    this.mapSvc.selection.subscribe( sel => {
      this.sel = sel
    })

    this.data.game.pipe(
      tap(g => this.game = g),
      mergeMap(g => this.mapSvc.mapConfig),
      tap( m => this.mapCfg = m),
      mergeMap( m => this.data.getActiveEncounter$(this.game.id, this.mapCfg.id)),
      tap( e => this.encounter = e), 
      tap( e => this.updateTeams())
    ).subscribe()

  }

  newEncounter() {
    const enc = new Encounter()
    enc.id = UUID.UUID().toString()
    enc.name = "Random Encounter"
    enc.owner = this.data.game.getValue().id
    enc.mapInfo = this.mapSvc.getMapInfo()
    enc.participants = this.calcParticipants()
    this.dialog.openEncounter(enc).subscribe(a => {
      this.data.activateEncounter(enc)
    })
  }

  select(item : TokenRecord) {
    // Get the tokenAnnotation
    const ta : TokenAnnotation = this.findToken(item)
    if (ta) {
      this.mapSvc.select(ta)
    }
  }

  isSelected(item ) {
    if (!this.sel.isEmpty()) {
      const ta: TokenAnnotation = this.findToken(item)
      return (this.sel.items.find( i => i.id == ta.id) != undefined)
    }
    return false
  }

  manage() {
    this.dialog.openEncounter(this.encounter).subscribe(a => {
      this.updateTeams()
      this.save()
    })
    
  }

  getMembers(team: string) {
    if (this.encounter) {
      return this.encounter.participants.filter(r => r.team == team || (r.team == undefined && team == 'None'))
    } else {
      return []
    }
  }

  loadEncounter() {

  }

  pic(item) {
    return item.token
  }

  caption(item) {
    return item.name ? item.name : "None"
  }

  badge(item) {
    return item.team ? item.team : "None"
  }

  updateTeams() {
    if (this.encounter) {
      this.teams = _.uniq(this.encounter.participants.map(r => r.team ? r.team : "None"))
    } else {
      this.teams = []
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

  calcParticipants(): TokenRecord[] {
    const map = this.mapSvc._map
    const rtn: TokenRecord[] = []
    map.eachLayer(l => {
      if (this.isToken(l)) {
        const token: TokenAnnotation = this.getItemFromLayer(l)
        const r = new TokenRecord()
        r.token = token.url
        r.id = token.itemId
        r.type = token.itemType
        this.fillIn(r)

        rtn.push(r)
      }
    })
    return rtn
  }

  fillIn(r: TokenRecord) {
    if (r.type == Character.TYPE) {
      const item: Character = this.data.gameAssets.characters.currentItems.find(i => i.id == r.id)
      if (item) {
        r.name = item.name
        r.hp = this.getAttrCurrent(item, 'HP')
        r.maxHp = this.getAttrMax(item, 'HP')
        r.team = 'Players'
        r.controlledBy = ['Everyone']
      }
    } else if (r.type == Monster.TYPE) {
      const item: Monster = this.data.gameAssets.monsters.currentItems.find(i => i.id == r.id)
      if (item) {
        r.name = item.name
        r.hp = item.hp
        r.maxHp = item.hp
        r.team = 'Enemies'
        r.controlledBy = ['GM']
        r.xp = item.xp
        r.treasure = item.treasure
      }
    } else if (r.type == Token.TYPE) {
      const item: Token = this.data.gameAssets.tokens.currentItems.find(i => i.id == r.id)
      if (item) {
        r.name = item.name
        r.team = 'Enemies'
        r.controlledBy = ['GM']
      }
    } else {
      throw new Error('Invlaid item type ' + r.type)
    }
  }

  getAttrCurrent(c: Character, attr: string): number {
    const a = c.attributes.find(item => item.attr == attr)
    if (a) {
      return a.current
    }
    return 0
  }

  getAttrMax(c: Character, attr: string): number {
    const a = c.attributes.find(item => item.attr == attr)
    if (a) {
      return a.max
    }
    return 0
  }

  isToken(l: any): boolean {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return true
    }
  }

  getItemFromLayer(l: any): TokenAnnotation {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return annotation
    }
    return undefined
  }

  save() {
    this.data.activateEncounter(this.encounter)
  }

  done() {
    const gameid = this.data.game.getValue().id
    const mapid= this.mapSvc._mapCfg.id
    this.data.deactivateEncounter(gameid, mapid)
  }
}
