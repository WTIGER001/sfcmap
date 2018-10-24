import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DialogService } from 'src/app/dialogs/dialog.service';
import { MapService } from 'src/app/maps/map.service';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { UUID } from 'angular2-uuid';
import { Layer } from 'leaflet';
import { Character, Annotation, TokenAnnotation, Asset, Selection, Game, MapConfig, ChatMessage, ChatRecord, DiceRoll } from 'src/app/models';
import { Token } from 'src/app/maps/token';
import { Monster } from 'src/app/monsters/monster';
import { LangUtil } from 'src/app/util/LangUtil';
import * as _ from 'lodash';
import { map, mergeMap, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MessageService } from 'src/app/message.service';
import { DiceRoller } from 'src/app/util/dice';
import { AudioService, Sounds } from 'src/app/audio.service';

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
  time : Date
  constructor(private data: DataService, private audioSvc : AudioService, private dialog: DialogService, private mapSvc: MapService, private msg : MessageService) { }

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

    this.mapSvc.annotationDeletions$.subscribe( a => {
      // We care
      console.log("Checking Delete ", a);
      if (TokenAnnotation.is(a) && this.encounter) {
        const indx = this.encounter.participants.findIndex(r => r.id == a.itemId)
        if (indx >= 0 ) {
          console.log("Removing Item from Encounter: ", indx, a.name)
          this.encounter.participants.splice(indx, 1)
          this.save()
        }
      } 
    })

    this.data.game.pipe(
      tap(g => "----->Game Changed"),
      mergeMap( message => this.msg.messages),
      tap(message => this.recordInit(message)) 
    ).subscribe()
  }

  recordInit(message: ChatRecord) {
    console.log("Checking Chat", message)
    if (this.encounter && DiceRoll.is( message.record)) {
      // character
      const r = message.record
      if (r.tokenId && r.rolltype == 'Initiative') {
        // Find the annotation
        const found = this.encounter.participants.find( a => a.id==r.tokenId)
        if (found) {
          console.log("Found Initiative Roll");
          found.initiative = r.getTotal()
          this.save()
        }
      }
    }
  }

  findById(id : string) {
    const f = this.encounter.participants.find(a => a.id == id)
    if (f) {
      return f
    }
    const f2 = this.encounter.participants.find(a => {
      const ta = this.findToken(a)
      if (ta) {
        return ta.itemId == id
      }
    })
    return f2
  }

  isInEncounter(a : TokenAnnotation) : boolean {
    const indx = this.encounter.participants.findIndex( r => r.id == a.itemId)
    return indx >= 0 
  }

  findLinkedItem(itemId : string, itemType : string): Character | Token | Monster {
    if (itemType == Character.TYPE) {
      return this.data.gameAssets.characters.currentItems.find(i => i.id == itemId)
    }
    if (itemType == Monster.TYPE) {
      // return this.data.gameAssets.monsters.currentItems.find(i => i.id == itemId)
      return this.data.pathfinder.monsters$.getValue().find(i => i.id == itemId)

    }
    if (itemType == Token.TYPE) {
      return this.data.gameAssets.tokens.currentItems.find(i => i.id == itemId)
    }
  }

  newEncounter() {
    this.time = new Date()
    const enc = new Encounter()
    enc.id = UUID.UUID().toString()
    enc.name = "Random Encounter"
    enc.owner = this.data.game.getValue().id
    enc.mapInfo = this.mapSvc.getMapInfo()
    const all = this.calcParticipants()
    this.dialog.openEncounter(enc, all).subscribe(a => {
      this.data.activateEncounter(enc)
    })
  }

  rollAllInitiatives() {
    console.log("Rolling for everyone")

    const roller = new DiceRoller(false, undefined )

    this.encounter.participants.forEach( (p) => {
      console.log("Rolling for ", p.name)
      const initRoll = this.getInit(p)
      console.log("INIT for ", initRoll)
      if (initRoll) {
        p.initiative =  roller.rollQuick(initRoll).getTotal()
      } 
    })
    this.audioSvc.play(Sounds.DiceRoll)
    this.save()
  }

  getInit(p : TokenRecord) : string {
    // find the init
    const token = this.findToken(p)
    console.log("Token: ", token)

    if (token) {
      const item = this.findLinkedItem(token.itemId, token.itemType)
      if (item) {
        if (Character.is(item)) {
          const found = item.rolls.find(r => r.name.toLowerCase() == 'initiative')
          if (found) {
            return found.expression
          }
        } else if (Monster.is(item)) {
          return "d20+"+item.init
        }
      }
    }
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
      if (ta) {
        return (this.sel.items.find( i => i.id == ta.id) != undefined)
      }
    }
    return false
  }

  manage() {
    // Calculate all the possible participants
    const possible = this.calcParticipants()
    // Determine who is not already in the encounter
    const diff = possible.filter(me => this.encounter.participants.findIndex( a => a.id == me.id) < 0)
    diff.forEach( a => a._delete = true)
    // Create the all map
    const all = [...this.encounter.participants.slice(0), ...diff]
    // all.push(...diff)

    this.dialog.openEncounter(this.encounter, all).subscribe(a => {
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
      const item: Monster = this.data.pathfinder.monsters$.getValue().find(i => i.id == r.id)
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
