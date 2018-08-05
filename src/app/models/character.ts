import { ObjectType } from "./core";
import { Distance } from "./units";

export class Character extends ObjectType {
  public static readonly TYPE = 'db.Character'
  public static readonly FOLDER = 'characters'
  readonly objType: string = Character.TYPE

  static is(obj: any): obj is Character {
    return obj.objType !== undefined && obj.objType === Character.TYPE
  }

  static to(obj: any): Character {
    return new Character().copyFrom(obj)
  }


  id: string
  name: string
  type: string
  description?: string
  weblink: string
  tags: string[] = []
  edit: string[]
  view: string[]

  picture: string
  icon: string

  info: PersonalInformation = new PersonalInformation()
  attachments: Attachment[] = []
  attributes: Attribute[] = []
  rolls: Roll[] = []


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
}

export class Roll {
  name: string
  expression: string
  value: string
}

export class MapLink {
  map: string
  coords: [number, number]
  description: string
  zoom: number
}