
import { ObjectType, Asset } from "./core";

// Holds the types used in the chat parts

export class ChatRecord extends Asset {
  public static readonly TYPE = 'chat.record'
  public static readonly FOLDER = 'chat'

  objType = ChatRecord.TYPE
  id: string
  time: number
  uid: string
  key: string
  record: ChatMessage | DiceRoll | PingMessage | any

  toDate(): Date {
    return new Date(this.time)
  }

  static is(obj: any): obj is ChatRecord {
    return obj.objType !== undefined && obj.objType === ChatRecord.TYPE
  }

  copyFrom(obj: any): ChatRecord {
    Object.assign(this, obj)

    if (ChatMessage.is(obj.record)) {
      this.record = ChatMessage.to(obj.record)
    } else if (DiceRoll.is(obj.record)) {
      this.record = DiceRoll.to(obj.record)
    } else if (PingMessage.is(obj.record)) {
      this.record = DiceRoll.to(obj.record)
    }
    return this
  }

  static to(item: any): ChatRecord {
    let obj = new ChatRecord()
    Object.assign(obj, item)

    if (ChatMessage.is(obj.record)) {
      obj.record = ChatMessage.to(obj.record)
    } else if (DiceRoll.is(obj.record)) {
      obj.record = DiceRoll.to(obj.record)
    } else if (PingMessage.is(obj.record)) {
      obj.record = DiceRoll.to(obj.record)
    }

    return obj
  }

  getExpression() : string {
    if (ChatMessage.is(this.record)) {
      return this.record.message
    } else if (DiceRoll.is(this.record)) {
      return this.record.expression
    }
    return undefined
  }
}

export class ChatMessage {
  public static readonly TYPE = 'chat.message'

  static to(item: any): ChatMessage {
    let obj = new ChatMessage()
    Object.assign(obj, item)
    return obj
  }

  // TypeScript guard
  static is(obj: any): obj is ChatMessage {
    return obj.objType !== undefined && obj.objType === ChatMessage.TYPE
  }

  message: string
  objType = ChatMessage.TYPE
}

export class DiceRoll {
  public static readonly TYPE = 'chat.diceroll'

  static to(item: any): DiceRoll {
    let obj = new DiceRoll()
    Object.assign(obj, item)

    for (let i = 0; i < obj.dice.length; i++) {
      let d = new DiceResult()
      Object.assign(d, obj.dice[i])
      obj.dice[i] = d
    }
    return obj
  }

  static copy(r: DiceRoll): DiceRoll {
    let obj = new DiceRoll()
    obj.modifier = r.modifier
    obj.expression = r.expression
    obj.rolltype = r.rolltype
    obj.tokenId = r.tokenId
    r.dice.forEach(die => {
      let d = new DiceResult()
      d.negative = die.negative
      d.threeDIndex = die.threeDIndex
      d.threeDIndex100 = die.threeDIndex100
      d.type = die.type
      d.value = die.value
      d.value100 = die.value100
      obj.dice.push(d)
    })
    return obj
  }

  // TypeScript guard
  static is(obj: any): obj is DiceRoll {
    return obj.objType !== undefined && obj.objType === DiceRoll.TYPE
  }

  objType = DiceRoll.TYPE
  modifier: number = 0
  expression: string
  dice: DiceResult[] = []
  _fav: boolean
  tokenId : string
  rolltype : string

  /**
   * 
   * @param numDice Number of DIce
   * @param numSides Number of Sides
   * @param negative Negative
   */
  addDice(numDice: number, numSides: number, negative?: boolean) {
    for (let i = 0; i < numDice; i++) {
      let di = new DiceResult()
      di.type = numSides
      di.negative = negative
      this.dice.push(di)
    }
  }

  addModifier(mod: number) {
    this.modifier += mod
  }

  getTotal(): number {
    // Sum the dice
    let diceTotal = 0
    this.dice.forEach(r => {
      if (r.negative) {
        diceTotal = diceTotal - r.getTotal()
      } else {
        diceTotal = diceTotal + r.getTotal()
      }
    })
    return diceTotal + this.modifier
  }

  getText(): string {
    let str = ""
    this.dice.forEach((d, i) => {
      if (i > 0 && d.negative == false) {
        str += " + "
      } else if (i > 0 || d.negative) {
        str += " - "
      } else if (d.negative) {
        str += "-"
      }
      str += "[" + d.type + "] " + (d.value + d.value100)
    })
    if (this.modifier > 0) {
      str = str + " + " + this.modifier
    }
    if (this.modifier < 0) {
      str = str + " - " + Math.abs(this.modifier)
    }
    str += " = " + this.getTotal()
    return str
  }

}

export class DiceResult {
  public static readonly TYPE = 'chat.diceroll'


  value: number = 0;
  value100: number = 0;
  type: number;
  threeDIndex: number = -1;
  threeDIndex100: number = -1;
  negative: boolean

  getNoClass(): boolean {
    switch (this.type) {
      case 2:
      case 4:
      case 6:
      case 8:
      case 10:
      case 12:
      case 20:
        return false
    }
    return true
  }

  getClass(): string {
    return "df-d" + this.type + "-" + this.value
  }

  isCriticalFail(): boolean {
    return this.type == 20 && this.value == 1
  }

  isCriticalSuccess(): boolean {
    return this.type == 20 && this.value == 20
  }

  isMax(): boolean {
    return this.type == this.value
  }

  isMin(): boolean {
    return this.value == 1
  }

  getTotal(): number {
    if (this.type == 100 && this.value == 0 && this.value100 == 0) {
      return 100
    }
    return this.value + this.value100
  }
}

export class PingMessage {
  public static readonly TYPE = 'chat.ping'
  static to(item: any): PingMessage {
    let obj = new PingMessage()
    Object.assign(obj, item)
    return obj
  }

  // TypeScript guard
  static is(obj: any): obj is PingMessage {
    return obj.objType !== undefined && obj.objType === PingMessage.TYPE
  }
  objType = PingMessage.TYPE
  lat: number
  lng: number
  map: string
  mapname: string
}

export class Online {
  id: string
  login: string
  image: string
  name: string
}

export class UserChatLastSeen {
  lastSeen: number
}

export class UserChatLastCleared {
  lastCleared: number
  game: string
}