import { ObjectType } from "./core";

export class Game extends ObjectType {
    public static readonly TYPE = 'db.Game'
    public static readonly FOLDER = 'games'
    readonly objType: string = Game.TYPE

    static is(obj: any): obj is Game {
        return obj.objType !== undefined && obj.objType === Game.TYPE
    }

    static to(obj: any): Game {
        return new Game().copyFrom(obj)
    }

    id: string
    name: string
    type: string
    description?: string
    weblink: string
    tags: string[] = []
    edit: string[]
    view: string[]


}