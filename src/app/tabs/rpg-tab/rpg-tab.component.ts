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
import { ICommand } from '../../commands/ICommand';
import { MessageService } from '../../message.service';

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
  commands = new Map<string, IChatCommand>()

  constructor(public data: DataService, public firedb: AngularFireDatabase, public audio: AudioService, public router: Router, public msg: MessageService) {
    this.data.user.subscribe(u => this.user = u)

    this.msg.rollRequests.subscribe(ex => {
      console.log("Recieved  Roll: ", ex);
      this.rollDice(ex)
    })

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

    this.initCommands()

    let found = (this.lastId == '')
    this.maps$ = this.data.gameAssets.maps.items$

    this.firedb.list<any>("chat").stateChanges()
      .subscribe(action => {
        // console.log("CHANGE ", action.type, " ", action.key, " ", action.prevKey);

        // if (this.keysSeen.has(action.key)) {

        // } else {
        this.keysSeen.set(action.key, true)
        let r = ChatRecord.to(action.payload.val())
        if (action.type == 'child_added') {
          if (found || r.key == this.lastId) {
            found = true
            this.records.unshift(r)
            this.audio.play(Sounds.Message)
          }
        } else if (action.type == 'child_removed') {
          // this.records.findIndex()
        }
      })

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

  isHelpMessage(item: any): boolean {
    return item.commands
  }

  newChatRecord(record?: any): ChatRecord {
    let c = new ChatRecord()
    c.time = Date.now()
    c.id = this.user.id
    c.record = record
    return c
  }

  saveRollOrChat(item) {
    let c = this.newChatRecord()
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
    let u = this.users.find(u => u.id == uid)
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
    let r = <ClientRect>this.canvas.nativeElement.getBoundingClientRect()
  }

  ngAfterViewInit() {
    if (this.canvas) {
      this.roller = new DiceRoller(true, this.canvas.nativeElement)
    }
  }

  enterAction(e: string) {
    console.log("Action: ", e)
    this.lastindex = -1

    if (e.toLowerCase().trim().startsWith("/")) {
      let cmd = this.commands.get(e.toLowerCase())
      if (cmd) {
        cmd.run(this)
      } else {
        console.log("Unknown Command ", e.toLowerCase());

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
      debounceTime(400),
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

  initCommands() {
    this.addCmd(new Clear())
    this.addCmd(new ClearPerm())
    this.addCmd(new ClearDice())
    this.addCmd(new Help())
    this.addCmd(new ClearType('me'))
    this.addCmd(new ClearType('messages'))
    this.addCmd(new ClearType('dice'))
    this.addCmd(new ClearType('pings'))
  }

  addCmd(c: IChatCommand) {
    this.commands.set(c.cmd, c)
  }

  addRecord(a: ChatRecord) {
    this.records.unshift(a)
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

interface IChatCommand {
  cmd: string
  help: string
  run(chat: RpgTabComponent)
}

class Help implements IChatCommand {
  cmd = '/help'
  help = "List available help commands"
  run(chat: RpgTabComponent) {
    let items = []
    chat.commands.forEach(v => {
      items.push({ cmd: v.cmd, help: v.help })
    })
    items.sort((a, b) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })

    let help = new HelpMessage()
    help.commands = items

    let c = chat.newChatRecord(help)
    chat.addRecord(c)
  }
}

class Clear implements IChatCommand {
  cmd = '/clear'
  help = "Clear chat messages"
  run(chat: RpgTabComponent) {
    chat.roller.clear()
    chat.records = []
  }
}

class ClearPerm implements IChatCommand {
  cmd = '/clear perm'
  help = "Clear chat messages and delete on server"
  run(chat: RpgTabComponent) {
    chat.roller.clear()
    chat.firedb.object("chat").remove()
    chat.records = []
  }
}

class ClearDice implements IChatCommand {
  cmd = '/cd'
  help = "Clear 3D Dice"
  run(chat: RpgTabComponent) {
    chat.roller.clear()
  }
}

class ClearType implements IChatCommand {
  constructor(private type: string) { }
  cmd = '/clear ' + this.type
  help = "Clear all " + this.type
  run(chat: RpgTabComponent) {
    chat.roller.clear()
    for (let i = chat.records.length - 1; i >= 0; i--) {
      if (this.type == 'dice' && chat.isDiceRoll(chat.records[i].record)) {
        chat.records.splice(i, 1)
      }
      if (this.type == 'pings' && chat.isPing(chat.records[i].record)) {
        chat.records.splice(i, 1)
      }
      if (this.type == 'me' && chat.records[i].id == chat.user.id) {
        chat.records.splice(i, 1)
      }
      if (this.type == 'messages' && chat.isMessage(chat.records[i].record)) {
        chat.records.splice(i, 1)
      }
    }
  }
}

class TransientMessage {
  message: string
}

class HelpMessage {
  commands = []
}