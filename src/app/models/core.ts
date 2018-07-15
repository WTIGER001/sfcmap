
export interface IObjectType {
    objType: string
    dbPath(): string
}

export interface IDbItem {
    id: string
    name: string
    description: string
}

export interface IRestrictedItem {
    edit: string[]
    view: string[]
}
