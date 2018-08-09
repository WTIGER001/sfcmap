import { Roll } from "./character";
import { ObjectType } from "./core";

export class GameSystem extends ObjectType {
    public static readonly TYPE = 'db.GameSystem'
    public static readonly FOLDER = 'game-systems'
    readonly objType: string = GameSystem.TYPE

    static is(obj: any): obj is GameSystem {
        return obj.objType !== undefined && obj.objType === GameSystem.TYPE
    }

    static to(obj: any): GameSystem {
        return new GameSystem().copyFrom(obj)
    }

    id: string
    name: string
    description: string
    logo: string
    logoSm: string
    tags: string
    theme: string
    edit: string[]
    view: string[]
    weblink: string

    primaryAttributes: string[] = []
    commonAttributes: string[] = []
    commonRolls: Roll[] = []
}

export class PrimaryAttribute {
    attr: string
    shape: 'heart' | 'shield' | 'rectangle' | 'circle'

}

