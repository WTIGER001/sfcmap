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

  type: TokenType = TokenType.People
  image : string
  fname : string
  tags : string[]
}

/**
 * Token Packs store tokens. A token pack is saved as a single JSON file and cached on the local machine. The images for each token can be stored
 * in fire storage or as external web urls. Token packs are published and are available in all games. Creating and editing a token pack is an 
 * admin function. Anyone that wants to use a token pack has to add that token pack to their account. When the user signs on then all of his or her
 * items are downloaded via the caching mechanism and automatically updated when they change. 
 * 
 * May need to include the concept of a "Author / Content Provider" that has special permissions (e.g. update)
 */
export class TokenPack extends Asset {
  public static readonly TYPE = 'db.TokenPack'
  public static readonly FOLDER = 'cache/tokenpacks'
  readonly objType: string = TokenPack.TYPE

static is(obj: any): obj is TokenPack {
    return obj.objType !== undefined && obj.objType === TokenPack.TYPE
  }

  static to(obj: any): TokenPack {
    return new TokenPack().copyFrom(obj)
  }

  artist : string
  website : string
  image : string
  tokens : Token[] = []
  tags: string[]
}

export enum TokenType {
  People = "People", 
  Objects = "Objects",
  Animals = "Animals", 
  Backgrounds = "Backgrounds"
}
