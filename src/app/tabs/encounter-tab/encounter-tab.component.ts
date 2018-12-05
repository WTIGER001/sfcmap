import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { mergeMap, tap } from 'rxjs/operators';
import { AudioService, Sounds } from 'src/app/audio.service';
import { DataService } from 'src/app/data.service';
import { DialogService } from 'src/app/dialogs/dialog.service';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { MapService } from 'src/app/maps/map.service';
import { Token } from 'src/app/maps/token';
import { MessageService } from 'src/app/message.service';
import { Annotation, Character, ChatRecord, DiceRoll, Game, MapConfig, Selection, TokenAnnotation } from 'src/app/models';
import { Monster } from 'src/app/monsters/monster';
import { DiceRoller } from 'src/app/util/dice';

@Component({
  selector: 'app-encounter-tab',
  templateUrl: './encounter-tab.component.html',
  styleUrls: ['./encounter-tab.component.css']
})
export class EncounterTabComponent implements OnInit {
  encounter: Encounter
  teams: string[]
  sel: Selection = new Selection([])
  game: Game
  mapCfg: MapConfig
  time: Date
  showBars = true
  constructor(private data: DataService, private audioSvc: AudioService, private dialog: DialogService, private mapSvc: MapService, private msg: MessageService) { }

  ngOnInit() {
    this.mapSvc.selection.subscribe(sel => {
      this.sel = sel
    })

    this.data.game.pipe(
      tap(g => this.game = g),
      mergeMap(g => this.mapSvc.mapConfig),
      tap(m => this.mapCfg = m),
      mergeMap(m => this.data.getActiveEncounter$(this.game.id, this.mapCfg.id)),
      tap(e => this.encounter = e),
      tap(e => this.updateTeams())
    ).subscribe()

    this.mapSvc.annotationDeletions$.subscribe(a => {
      // We care
      console.log("Checking Delete ", a);
      if (TokenAnnotation.is(a) && this.encounter) {
        const indx = this.encounter.participants.findIndex(r => r.id == a.id)
        if (indx >= 0) {
          console.log("Removing Item from Encounter: ", indx, a.name)
          this.encounter.participants.splice(indx, 1)
          this.save()
        }
      }
    })

    this.data.game.pipe(
      mergeMap(message => this.msg.messages),
      tap(message => this.recordInit(message))
    ).subscribe()
  }

  recordInit(message: ChatRecord) {
    if (this.encounter && DiceRoll.is(message.record)) {
      // character
      const r = message.record
      if (r.tokenId && r.rolltype == 'Initiative') {
        // Find the annotation
        const found = this.encounter.participants.find(a => a.id == r.tokenId)
        if (found) {
          console.log("Found Initiative Roll");
          found.initiative = r.getTotal()
          this.save()
        }
      }
    }
  }

  findById(id: string) {
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

  isInEncounter(a: TokenAnnotation): boolean {
    const indx = this.encounter.participants.findIndex(r => r.id == a.itemId)
    return indx >= 0
  }

  findLinkedItem(itemId: string, itemType: string): Character | Token | Monster {
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
    this.dialog.openEncounter(enc, all[0], all[1]).subscribe(a => {
      this.labelDuplicates(enc)
      this.data.activateEncounter(enc)
    })
  }

  rollAllInitiatives() {
    console.log("Rolling for everyone")
    const roller = new DiceRoller(false, undefined)
    this.encounter.participants.forEach((p) => {
      const initRoll = this.getInit(p)
      if (initRoll) {
        p.initiative = roller.rollQuick(initRoll).getTotal()
      }
    })
    this.audioSvc.play(Sounds.DiceRoll)
    this.save()
  }

  getInit(p: TokenRecord): string {
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
          return "d20+" + item.init
        }
      }
    }
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
      if (ta) {
        return (this.sel.items.find(i => i.id == ta.id) != undefined)
      }
    }
    return false
  }

  manage() {
    // Calculate all the possible participants
    const [possible, tokens] = this.calcParticipants()
    // Determine who is not already in the encounter
    const diff = possible.filter(me => this.encounter.participants.findIndex(a => a.id == me.id) < 0)
    diff.forEach(a => a._delete = true)
    // Create the all map
    const all = [...this.encounter.participants.slice(0), ...diff]
    // all.push(...diff)

    this.dialog.openEncounter(this.encounter, all, tokens).subscribe(a => {
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


  isDead(item) : boolean {
   const t = this.findToken(item)
    if (t) {
      return t.dead
    }
    return false 
  }

  
  pic(item) {
    const t = this.findToken(item)
    if (t) {
      return t.url
    }
    return undefined
  }

  caption(item) {
    const t = this.findToken(item)
    if (t) {
      return t.name
    }
    return "None"
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
    this.labelDuplicates(this.encounter)
  }

  findToken(item: TokenRecord): TokenAnnotation {
    const map = this.mapSvc._map
    let rtn: TokenAnnotation
    map.eachLayer(l => {
      if (this.isToken(l)) {
        const token: TokenAnnotation = this.getItemFromLayer(l)
        if (token.id == item.id) {
          rtn = token
        }
      }
    })
    return rtn
  }

  calcParticipants(): [TokenRecord[], TokenAnnotation[]] {
    const map = this.mapSvc._map
    const rtn: TokenRecord[] = []
    const tokens : TokenAnnotation[] = []
    map.eachLayer(l => {
      if (this.isToken(l)) {
        const token: TokenAnnotation = this.getItemFromLayer(l)
        const r = new TokenRecord()
        r.itemid = token.itemId
        r.id = token.id
        r.type = token.itemType
        this.fillIn(r)
        tokens.push(token)
        rtn.push(r)
      }
    })
    return [rtn, tokens]
  }

  fillIn(r: TokenRecord) {
    if (r.type == Character.TYPE) {
      const item: Character = this.data.gameAssets.characters.currentItems.find(i => i.id == r.itemid)
      if (item) {
        r.team = 'Players'
      }
    } else if (r.type == Monster.TYPE) {
      const item: Monster = this.data.pathfinder.monsters$.getValue().find(i => i.id == r.itemid)
      if (item) {
        r.team = 'Enemies'
      }
    } else if (r.type == Token.TYPE) {
      const item: Token = this.data.gameAssets.tokens.currentItems.find(i => i.id == r.itemid)
      if (item) {
        r.team = 'Enemies'
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
    const mapid = this.mapSvc._mapCfg.id
    this.data.deactivateEncounter(gameid, mapid)
  }

  labelDuplicates(encounter : Encounter) {
    if (encounter && encounter.participants) {
      const dups = new Map<string, number>()
      encounter.participants.forEach(p => {
        let num = 0
        if (dups.has(p.itemid)) {
          num = dups.get(p.itemid)
        }
        dups.set(p.itemid, num+1)
        p.badge = this.toAlpha(num)
      })
    
      encounter.participants.forEach(p => {
        if (dups.get(p.itemid) == 1) {
          p.badge = ''
        }
      })
      console.log("Duplicates :", dups)
    }
  }

  toAlpha(value : number ) : string {
    var range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var new_value = '';
    var dec_value = value
    while (dec_value > 0) {
      new_value = range[dec_value % 10] + new_value;
      dec_value = (dec_value - (dec_value % 10)) / 10;
    }
    return new_value || 'A'
  }
}
