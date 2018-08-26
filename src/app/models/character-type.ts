import { IObjectType, ObjectType, Asset } from "./core";
import { Character } from "./character";

/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class CharacterType extends Asset {
  public static readonly TYPE = 'db.CharacterType'
  public static readonly FOLDER = 'character-types'
  readonly objType: string = CharacterType.TYPE

  static is(obj: any): obj is CharacterType {
    return obj.objType !== undefined && obj.objType === CharacterType.TYPE
  }

  static to(obj: any): CharacterType {
    return new CharacterType().copyFrom(obj)
  }

  id: string
  name: string
  order: number
  _characters: Character[] = []
}
