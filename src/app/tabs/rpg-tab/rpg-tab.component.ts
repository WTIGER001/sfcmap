import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Dice, DiceRoller } from '../../util/dice';
import * as THREE from 'src/scripts/three.min.js'
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { emojify, search } from 'node-emoji';
import { DataService } from '../../data.service';
import { User, ChatRecord, ChatMessage, DiceRoll, PingMessage, MapConfig, Prefs } from '../../models';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { LangUtil } from '../../util/LangUtil';
import { AudioService, Sounds } from '../../audio.service';
import { Ping } from '../../leaflet/ping';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rpg-tab',
  templateUrl: './rpg-tab.component.html',
  styleUrls: ['./rpg-tab.component.css']
})
export class RpgTabComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef
  @ViewChild('prev') prev: ElementRef
  @ViewChild('actionBox') actionbox: any
  @ViewChild('acc') acc: any

  expressionHistory: string[] = []
  records: ChatRecord[] = []
  box: Dice
  lastindex = -1
  roller: DiceRoller
  result: string
  action: string
  user: User
  prefs: Prefs
  users: User[]
  lastId: string
  maps$
  keysSeen = new Map<string, boolean>()

  constructor(private data: DataService, private firedb: AngularFireDatabase, private audio: AudioService, private router: Router) {
    this.data.userPrefs.subscribe(u => {
      this.prefs = u
      if (this.roller) {
        this.roller.use3d = u.use3dDice
        this.lastId = u.lastChatId
      }
    })

    this.data.users.subscribe(u => {
      this.users = u
    })

    let found = (this.lastId == '')
    this.maps$ = this.data.maps

    // this.maps = this.data.maps.pipe(
    //   tap(m => this.records.splice(0)),
    //   mergeMap(m => this.firedb.list<any>("chat").stateChanges())
    this.firedb.list<any>("chat").stateChanges()
      .subscribe(action => {
        console.log("CHANGE ", action.type, " ", action.key, " ", action.prevKey);

        // if (this.keysSeen.has(action.key)) {

        // } else {
        this.keysSeen.set(action.key, true)
        let r = ChatRecord.to(action.payload.val())
        if (action.type == 'child_added') {
          if (found || r.key == this.lastId) {
            found = true
            this.records.unshift(r)
          }
        } else if (action.type == 'child_removed') {
          // this.records.findIndex()
        }
        // }
      })

    // (events: ChildEvent[]) : Observable<AngularFireAction<DatabaseSnapshot<any>>[])
  }

  isMessage(item: any): boolean {
    return ChatMessage.is(item)
  }

  isDiceRoll(item: any): boolean {
    return DiceRoll.is(item)
  }

  isPing(item: any): boolean {
    return PingMessage.is(item)
  }

  saveRollOrChat(item) {
    let c = new ChatRecord()
    c.time = Date.now()
    c.uid = this.user.uid
    c.record = LangUtil.prepareForStorage(item)

    if (DiceRoll.is(c.record)) {
      let d = c.record
      for (let i = 0; i < d.dice.length; i++) {
        d.dice[i] = LangUtil.prepareForStorage(d.dice[i])
      }
    }
    this.firedb.list("chat").push(c)
  }

  isFav(expression: string): boolean {
    if (expression && this.prefs.savedExpressions) {
      let yes = this.prefs.savedExpressions.map(a => a.toLowerCase()).includes(expression.toLowerCase())
      return yes
    }
    return false
  }

  link(rec: ChatRecord) {
    let item = rec.record
    if (PingMessage.is(item)) {
      let coords = item.lat + "," + item.lng
      return ['map', item.map, { coords: coords, flag: true }]
    }
  }

  toggleFav(expression: string) {
    if (!this.prefs.savedExpressions) {
      this.prefs.savedExpressions = []
    }

    if (this.isFav(expression)) {
      let inx = this.prefs.savedExpressions.findIndex(a => a.toLowerCase() == expression.toLowerCase())
      this.prefs.savedExpressions.splice(inx)
    } else {
      this.prefs.savedExpressions.push(expression)
    }

    this.data.save(this.user)
  }

  username(uid): string {
    let u = this.users.find(u => u.uid == uid)
    if (u) {
      return u.name
    }
    return `Unknown ($uid)`;
  }

  ngOnInit() {
  }

  keydown() {
    if (!this.acc.isPopupOpen()) {
      this.lastindex = this.lastindex > 0 ? this.lastindex - 1 : 0
      this.action = this.expressionHistory[this.lastindex]
    }
  }

  keyup() {
    if (!this.acc.isPopupOpen()) {
      this.lastindex = this.lastindex < this.expressionHistory.length - 1 ? this.lastindex + 1 : 20
      this.action = this.expressionHistory[this.lastindex]
    }
  }

  resize(e) {
    console.log("resize: ", e);
    let r = <ClientRect>this.canvas.nativeElement.getBoundingClientRect()
    console.log("resize: ", r);
  }

  ngAfterViewInit() {
    this.roller = new DiceRoller(true, this.canvas.nativeElement)
  }

  enterAction(e: string) {
    console.log("Action: ", e)
    this.lastindex = -1

    if (e.toLowerCase().trim().startsWith("/")) {
      // Then this is a command 
      if (e.toLowerCase() == "/clear") {
        this.roller.clear()

        if (this.records.length > 0) {
          let item = this.records[this.records.length - 1]
          // this.user.prefs.lastChatId = item.key
          this.data.save(this.user)
        }

        this.records = []
      } else if (e.toLowerCase() == "/cd") {
        this.roller.clear()
      } else if (e.toLowerCase() == "/clear perm") {
        this.roller.clear()
        // this.firedb.list<any>("chat")
        this.firedb.object("chat").remove()
        this.records = []
      }
    } else if (this.roller.isDiceExpression(e)) {
      this.rollDice(e)
    } else {
      // this.rolls.push(new ChatMessage(e))
      let message = new ChatMessage()
      message.message = e
      this.saveRollOrChat(message)
    }

    // this.actionbox.nativeElement.value = ""
    this.action = ""
  }

  update(e) {
    console.log("Update Action: ", e)
  }

  rollDice(expression: string) {
    this.audio.play(Sounds.DiceRoll)

    let indx = this.expressionHistory.findIndex(item => item.toLowerCase() == expression.toLowerCase())
    if (indx >= 0) {
      this.expressionHistory.splice(indx)
    }
    this.expressionHistory.unshift(expression)
    if (this.expressionHistory.length > 20) {
      this.expressionHistory.splice(20)
    }

    this.roller.rollDice(expression).subscribe(r => {
      // this.rolls.push(r)
      this.saveRollOrChat(r)
    })

  }

  dblClick(rec: ChatRecord) {
    if (DiceRoll.is(rec.record)) {
      this.rollDice(rec.record.expression)
    } else if (PingMessage.is(rec.record)) {
      this.router.navigate(this.link(rec))
    }
  }


  roll() {

  }

  setResult(notation, result) {

  }

  searchFor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => RpgTabComponent.getResults(term))
    );

  getEmojis(prefix: string): Emoji[] {
    return search(prefix)
  }

  resultFormatter = (x: FormatResult) => x.emoji.emoji + ":" + x.emoji.key + ":";
  formatter = (x: FormatResult) => x.toText ? x.toText() : x;

  static getResults(term: string): FormatResult[] {
    let colonCount = (term.match(":") || []).length
    let charsAfter = term.length - term.lastIndexOf(":")
    if (colonCount % 2 == 1 && charsAfter > 1) {
      let searchTerm = term.substr(term.lastIndexOf(":"))
      return search(searchTerm).slice(0, 10).map(a => new FormatResult(a, term))
    }
    return []
  }
}


class FormatResult {
  constructor(public emoji: Emoji, public term: string) {
    console.log("CREATED ", this);
  }

  toText(): string {
    let indx = this.term.lastIndexOf(":")
    return this.term.substr(0, indx) + ":" + this.emoji.key + ":"
  }
}

interface Emoji {
  key: string,
  emoji: string
}