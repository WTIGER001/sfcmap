import { Character, Attribute, Roll } from "../models";
import { ReplaySubject, Observable } from "rxjs";
import { UUID } from "angular2-uuid";


export class PCGen {
  public static importData(data: string): Observable<Character[]> {
    const rtn = new ReplaySubject<Character[]>()
    const items: Character[] = []

    console.log("DATA, ", data);


    const p = PCGenCharacter.from(data)
    const c = new Character()
    c.id = UUID.UUID().toString()

    // # Character Bio
    c.name = p.oneValueStr("CHARACTERNAME")

    // # Character Attributes
    c.attributes.push(...p.stats())

    // # Character Class(es)
    c.classes = p.classes()

    // # Character Skills
    c.rolls.push(...p.skills())




    rtn.next(items)
    rtn.complete()

    return rtn
  }





}

export class PCGenCharacter {
  lines: PCGenLine[] = []
  static from(data: String): PCGenCharacter {
    const pc = new PCGenCharacter()
    const lines = data.split("\n")
    lines.forEach(l => {
      const real = l.trim()
      if (real.length > 3) {
        const pcLine = PCGenLine.from(real)
        pc.lines.push(pcLine)
      }
    })
    return pc
  }

  classes(): string {
    const stats = this.findAll("CLASS")
    let rtn = ''
    stats.forEach(c => {
      rtn = rtn + c.value + "(" + c.str("LEVEL") + ") "
    })
    return rtn.trim()
  }

  oneValueStr(key: string): string {
    const found = this.lines.find(l => l.first == key)
    if (found) {
      return found.pairs.get(key)
    }
    return undefined
  }

  stats(): Attribute[] {
    const stats = this.findAll("STAT")
    const rtn: Attribute[] = []
    stats.forEach(s => {
      rtn.push(Attribute.from(s.value, s.num("SCORE")))
    })
    return rtn
  }

  skills(): Roll[] {
    const stats = this.findAll("SKILL")
    const rtn: Roll[] = []
    stats.forEach(s => {
      rtn.push(Roll.from(s.value, "d20 +" + s.num("RANK")))
    })
    return rtn
  }

  stat(type: string): number {
    // Stats
    const line = this.findPair("STAT", "type")
    if (line) {
      const v = line.pairs.get("SCORE")
      return this.toInt(v, 0)
    }
    return 0
  }

  toInt(v: string, def: number): number {
    try {
      return parseInt(v)
    } catch {

    }
    return def
  }

  findAll(key: string): PCGenLine[] {
    return this.lines.filter(a => a.first == key)
  }
  findPair(key: string, value: string): PCGenLine {
    return this.lines.find(a => a.first == key && value == a.value)

  }

  oneValueNum(key: string): number {
    const found = this.lines.find(l => l.first == key)
    if (found) {
      let v = found.pairs.get(key)
      try {
        return parseInt(v)
      } catch {

      }
    }
    return -100
  }
}

export class PCGenLine {
  first: string
  value: string
  pairs: Map<string, string> = new Map()

  static from(line: string): PCGenLine {
    const pc = new PCGenLine()
    const parts = line.split("|")
    parts.forEach(p => {
      if (p.length > 3) {
        const valParts = p.split(":")
        if (valParts.length == 2) {
          if (!pc.first) {
            pc.first = valParts[0]
            pc.value = valParts[1]
          }
          pc.pairs.set(valParts[0], valParts[1])
        } else {
          console.log("Invalid line: >>", p);
        }
      }
    })
    return pc
  }

  str(key: string): string {
    return this.pairs.get(key)
  }
  num(key: string, defaultValue?: number): number {
    return this.toInt(this.pairs.get(key), defaultValue)
  }

  toInt(v: string, def?: number): number {
    const defaultValue = def || 0
    try {
      return parseInt(v)
    } catch {

    }
    return defaultValue
  }
}

export class Pair {
  name: string
  value: string
}