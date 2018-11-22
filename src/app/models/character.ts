import { ObjectType, RestrictedContent, Asset } from "./core";
import { Distance } from "./units";
import { Aura } from "./aura";
import { LightSource } from "./light-vision";
import { TokenBar } from "./annotations";

export class Character extends Asset {
  public static readonly TYPE = 'db.Character'
  public static readonly FOLDER = 'characters'
  public static readonly RESTRICTABLE = ['description', 'weblink', 'info', 'attributes', 'attachments', 'rolls', 'speed', 'vision', 'reach', 'classes', 'alignment']
  readonly objType: string = Character.TYPE

  static is(obj: any): obj is Character {
    return obj.objType !== undefined && obj.objType === Character.TYPE
  }

  static to(obj: any): Character {
    return new Character().copyFrom(obj)
  }


  id: string
  rollId: string // who i roll as
  name: string
  type: string

  description?: string
  pageUrl: string
  mapLink: string
  tags: string[] = []
  picture: string
  token: string
  imagePos: number = 5

  info: PersonalInformation = new PersonalInformation()
  attachments: Attachment[] = []
  attributes: Attribute[] = []
  rolls: Roll[] = []

  speed: string
  vision: string
  reach: string
  size: string

  race: string
  classes: string
  alignment: string
  conditions: any

  bars: TokenBar[];
  auras: Aura[] = []
  lights: LightSource[] = []

  resolveExpression(expression: string): string {
    let newexp = expression
    this.attributes.forEach(attr => {
      newexp = newexp.replace(attr.attr, attr.current + "")
    })
    return newexp
  }
}

export class PersonalInformation {
  size: string
  vision: Distance
  reach: Distance
  speed: Distance
}

export class Attachment {
  name: string
  url: string
  size: number
}

export class Attribute {
  attr: string
  max: number
  current: number

  static from(attr: string, max: any, current?: any) {
    const a = new Attribute();
    a.attr = attr
    a.max = parseInt(max)
    if (isNaN(a.max)) {
      a.max = -1
    }

    if (a.current) {
      a.current = parseInt(current)
    } else {
      a.current = a.max
    }
    if (isNaN(a.current)) {
      a.current = -1
    }

    return a
  }
}

export class Roll {
  name: string
  expression: string
  value: string

  static from(name: string, exp: string) {
    const a = new Roll();
    a.name = name
    a.expression = exp
    return a
  }
}

export class MapLink {
  map: string
  coords: [number, number]
  description: string
  zoom: number
}
