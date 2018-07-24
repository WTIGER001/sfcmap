import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Dice, DiceRoller } from '../../util/dice';
import * as THREE from 'src/scripts/three.min.js'
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { emojify, search } from 'node-emoji';
import { DataService } from '../../data.service';
import { User, ChatRecord, ChatMessage, DiceRoll } from '../../models';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';
import { LangUtil } from '../../util/LangUtil';

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
  users: User[]
  audio: HTMLAudioElement
  lastId: number
  constructor(private data: DataService, private firedb: AngularFireDatabase) {
    this.data.user.subscribe(u => {
      this.user = u
      if (this.roller) {
        this.roller.use3d = u.prefs.use3dDice
      }
    })

    this.data.users.subscribe(u => this.users = u)

    this.firedb.list<any>("chat").stateChanges().subscribe(action => {
      console.log("TYPE ", action.type);
      console.log("KEY ", action.key);
      console.log("PAYLOAD ", action.payload.val());

      let r = ChatRecord.to(action.payload.val())
      this.records.push(r)
    })

    // (events: ChildEvent[]) : Observable<AngularFireAction<DatabaseSnapshot<any>>[])
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
    if (this.user.prefs.savedExpressions) {
      let yes = this.user.prefs.savedExpressions.map(a => a.toLowerCase()).includes(expression.toLowerCase())
      return yes
    }
    return false
  }

  toggleFav(expression: string) {
    if (!this.user.prefs.savedExpressions) {
      this.user.prefs.savedExpressions = []
    }

    if (this.isFav(expression)) {
      let inx = this.user.prefs.savedExpressions.findIndex(a => a.toLowerCase() == expression.toLowerCase())
      this.user.prefs.savedExpressions.splice(inx)
    } else {
      this.user.prefs.savedExpressions.push(expression)
    }
    console.log("TOGGLED ", expression, " ", this.user.prefs.savedExpressions);

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
    this.audio = new Audio('./assets/audio/dice.mp3');
  }

  keydown() {
    if (!this.acc.isPopupOpen()) {
      this.lastindex = this.lastindex > 0 ? this.lastindex - 1 : 0
      // this.actionbox.nativeElement.value = this.expressionHistory[this.lastindex]
      this.action = this.expressionHistory[this.lastindex]
    }
  }

  keyup() {
    if (!this.acc.isPopupOpen()) {
      this.lastindex = this.lastindex < this.expressionHistory.length - 1 ? this.lastindex + 1 : 20
      // this.actionbox.nativeElement.value = this.expressionHistory[this.lastindex]
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

  enterAction(e) {
    console.log("Action: ", e)
    this.lastindex = -1

    if (e.toLowerCase() == "/clear") {
      this.roller.clear()

      if (this.records.length > 0) {
        let item = this.records[this.records.length - 1]

      }
      this.records = []
    } else if (e.toLowerCase() == "/cd") {
      this.roller.clear()
    } else if (this.roller.isDiceExpression(e)) {
      if (this.user.prefs.sounds) {
        this.audio.play();
      }
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