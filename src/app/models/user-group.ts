import { IObjectType, ObjectType } from "./core";

export class UserGroup extends ObjectType {
    public static readonly TYPE = 'db.UserGroup'
    public static readonly FOLDER = 'groups'
    readonly objType: string = UserGroup.TYPE

    // TypeScript guard
    static is(obj: any): obj is UserGroup {
        return obj.objType !== undefined && obj.objType === UserGroup.TYPE
    }

    static to(obj: any): UserGroup {
        return new UserGroup().copyFrom(obj)
    }

    dbPath(): string {
        return UserGroup.FOLDER + "/" + this.name
    }

    id: string
    name: string
    description?: string
    members: string[]
    edit: string[] = []
    view: string[] = []
}