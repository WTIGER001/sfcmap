import { IObjectType } from "./core";

export class UserGroup implements IObjectType {
    public static readonly TYPE = 'db.UserGroup'
    public static readonly FOLDER = 'groups'
    // TypeScript guard
    static is(obj: any): obj is UserGroup {
        return obj.objType !== undefined && obj.objType === UserGroup.TYPE
    }

    dbPath(): string {
        return UserGroup.FOLDER + "/" + this.name
    }

    readonly objType: string = UserGroup.TYPE
    id: string
    name: string
    description?: string
    members: string[]
    edit: string[] = []
    view: string[] = []
}