import { ObjectType } from "../../models";
import { LatLng } from "leaflet";

export class Encounter extends ObjectType {
    public static readonly TYPE = 'db.Encounter'
    public static readonly FOLDER = 'encounters'
    readonly objType: string = Encounter.TYPE

    static is(obj: any): obj is Encounter {
        return obj.objType !== undefined && obj.objType === Encounter.TYPE
    }

    static to(obj: any): Encounter {
        return new Encounter().copyFrom(obj)
    }

    static folder(obj: Encounter) {
        return Encounter.FOLDER
    }

    static path(obj: Encounter) {
        return Encounter.folder(obj) + "/" + obj.id
    }

    id: string
    name: string
    description: string
    edit: string[]
    view: string[]
    tags: string[]

    completed: boolean
    characters: string[] = []
    map: string
    zoom: number
    x: number
    y: number
    adminNotes: AdminNotes

    characterLocations: CharacterLocation[] = []
    initativeOrder: string[] = []
    resolutionNotes: string
    completedDate: Date
}

export class AdminNotes {
    notes: string
    edit: string[]
    view: string[]
}

export class CharacterLocation {
    character: string
    coords: [number, number]
}