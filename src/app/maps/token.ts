import { Asset } from "../models";

export class Token extends Asset {
  public static readonly TYPE = 'db.Token'
  public static readonly FOLDER = 'tokens'
  readonly objType: string = Token.TYPE

  static is(obj: any): obj is Token {
    return obj.objType !== undefined && obj.objType === Token.TYPE
  }

  static to(obj: any): Token {
    return new Token().copyFrom(obj)
  }

  image : string

}