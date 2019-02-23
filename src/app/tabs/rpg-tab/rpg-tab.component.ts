import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { search } from 'node-emoji';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AudioService, Sounds } from '../../audio.service';
import { DiceCanvasComponent } from '../../controls/dice-canvas/dice-canvas.component';
import { DataService } from '../../data.service';
import { MessageService } from '../../message.service';
import { ChatMessage, ChatRecord, DiceRoll, Game, PingMessage, Prefs, User, UserChatLastSeen } from '../../models';
import { Dice } from '../../util/dice';

@Component({
  selector: 'app-rpg-tab',
  templateUrl: './rpg-tab.component.html',
  styleUrls: ['./rpg-tab.component.css']
})
export class RpgTabComponent implements OnInit {
  @ViewChild('dice') dice: DiceCanvasComponent
  @ViewChild('prev') prev: ElementRef
  @ViewChild('actionBox') actionbox: any
  @ViewChild('acc') acc: any

  game : Game 
  records: ChatRecord[] = []
  box: Dice
  lastindex = -1
  result: string
  action: string
  user: User
  prefs: Prefs
  users: User[]
  lastId: string
  maps$
  keysSeen = new Map<string, boolean>()
  commands = new Map<string, IChatCommand>()
  subLastSeen: Subscription
  lastSeen: UserChatLastSeen

  constructor(public data: DataService,  public audio: AudioService, public router: Router, public msg: MessageService) {
    this.data.user.subscribe(u => this.user = u)
    this.data.users.subscribe(u => this.users = u)

    this.msg.rollRequests.subscribe(ex => {
      this.dice.rollDice(ex)
    })

    this.data.userPrefs.subscribe(u => {
      this.prefs = u
      this.lastId = u.lastChatId
    })

    this.initCommands()

    this.maps$ = this.data.gameAssets.maps.items$

    this.msg.getMyChatMessages2().subscribe(r => {
      this.records.unshift(r)
      if (!this.lastSeen || this.lastSeen.lastSeen < r.time) {
        if (r.uid != this.user.id) {
          this.audio.play(Sounds.Message)
        }
      }
      this.msg.setLastSeen(r.time)
    })


    this.data.game.subscribe(game => {
      this.game = game
      this.records = []
      if (this.subLastSeen) {
        this.subLastSeen.unsubscribe()
      }
      this.subLastSeen = this.msg.getLastSeen().subscribe(i => this.lastSeen = i)
    })
  }

  diceRolled() {

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

  isStatsMessage(item: any): boolean {
    return item.stats
  }

  newChatRecord(record?: any): ChatRecord {
    let c = new ChatRecord()
    c.time = Date.now()
    c.id = this.user.id
    c.record = record
    return c
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
      console.log("PING RECIEVED", item)
      let coords = item.lat + "," + item.lng
      return ['/game', this.game.id, 'maps', item.map, { coords: coords, flag: true }]
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
    return this.data.displayName(uid)
  }

  ngOnInit() {
  }

  keydown() {
    this.incLast(-1)
  }

  keyup() {
    this.incLast(1)
  }

  incLast(amount : number) {
    if (!this.acc.isPopupOpen()) {
      const mine = this.records
        .filter(r => r.uid == this.user.id && r.getExpression() != undefined)
        .map(r => r.getExpression())
      const expressions = _.uniq(mine)

      this.lastindex += amount
      if (this.lastindex > expressions.length - 1) {
        this.lastindex = 0
      }

      if (this.lastindex >= 0) {
        this.action = expressions[this.lastindex]
      }
    }
  }

  enterAction(e: string) {
    this.lastindex = -1
   
    if (e.toLowerCase().trim().startsWith("/")) {
      let cmd = this.commands.get(e.toLowerCase())
      if (cmd) {
        cmd.run(this)
      } else {
        console.log("Unknown Command ", e.toLowerCase());
      }
    } else if (this.dice.roller.isDiceExpression(e)) {
      this.dice.rollDice(e)
    } else {
      let message = new ChatMessage()
      message.message = e
      this.msg.sendMessage(message);
    }
    this.action = ""
  }

  update(e) {
    console.log("Update Action: ", e)
  }

  dblClick(rec: ChatRecord) {
    if (DiceRoll.is(rec.record)) {
      this.dice.rollDice(rec.record.expression)
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
    this.addCmd(new Stats())
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
    chat.dice.roller.clear()
    chat.records = []
    chat.msg.clearGameMessages()
  }
}

class ClearPerm implements IChatCommand {
  cmd = '/clear perm'
  help = "Clear chat messages and delete on server (GMs Only)"
  run(chat: RpgTabComponent) {
    chat.dice.roller.clear()
    // chat.firedb.object("chat").remove()
    chat.msg.deleteGameMessages()
    chat.records = []
  }
}

class ClearDice implements IChatCommand {
  cmd = '/cd'
  help = "Clear 3D Dice"
  run(chat: RpgTabComponent) {
    chat.dice.roller.clear()
  }
}

class ClearType implements IChatCommand {
  constructor(private type: string) { }
  cmd = '/clear ' + this.type
  help = "Clear all " + this.type
  run(chat: RpgTabComponent) {
    chat.dice.roller.clear()
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

class Stats implements IChatCommand {
  old
  cmd: string = '/stats'
  help: string = 'print stats';
  run(chat: RpgTabComponent) {

    const recieved = RItem.generate(chat.data.received, this.old)
    this.old = recieved
    let help = new StatsMessage()
    help.stats = recieved

    let c = chat.newChatRecord(help)
    chat.addRecord(c)
  }
}

class TransientMessage {
  message: string
}


class HelpMessage {
  commands = []
}


class StatsMessage {
  stats = []
}

class RItem {
  name: string;
  count: number;
  sum: number;
  raw: number[];
  diff: boolean = false

  static generate(r: {}, old: RItem[]): RItem[] {
    const items: RItem[] = []
    const objs = _.toPairs(r)
    const rtn = objs.map((i: any) => {
      const ritem = new RItem()
      ritem.name = i[0]
      ritem.count = i[1].length
      ritem.sum = _.sum(i[1])
      ritem.diff = false
      ritem.raw = i[1]
      return ritem
    })

    if (old) {
      rtn.forEach(me => {
        const oldOne = old.find(a => a.name == me.name)
        if (oldOne) {
          me.diff = me.count != oldOne.count
        } else {
          me.diff = true
        }
      })
    }

    return rtn
  }
}