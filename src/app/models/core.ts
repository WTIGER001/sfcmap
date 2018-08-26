import { AngularFireAction, DatabaseSnapshot } from "angularfire2/database";
import { isArray } from "util";

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

export abstract class ObjectType {
  dbPath(): string {
    throw new Error("Method not implemented.");
  }

  copyFrom(obj: any): any {
    Object.assign(this, obj)
    // Make a new copy of the arrays...maybe even the items too!
    Object.keys(obj).forEach( key => {
      const fld = obj[key]
      if (isArray(fld)) {
        this[key] = fld.slice(0)
      }
    })
    return this
  }
}

export enum Operation {
  Added = 0,
  Removed = 1,
  Updated = 2
}

export class ItemAction<T> {
  public op: Operation
  constructor(public action: string, public item: T) {
    if (action == 'child_added') {
      this.op = Operation.Added
    } else if (action == 'child_removed') {
      this.op = Operation.Removed
    } else if (action == 'value') {
      this.op = Operation.Updated
    }
  }
}

export enum Restricition {
  PlayerReadWrite = 0,
  PlayerRead = 1,
  None = 2
}

export interface IRestrictedContent<T> {
  restriction: Restricition
  item: T
}

export class RestrictedContent<T> implements IRestrictedContent<T> {
  restriction: Restricition = Restricition.PlayerReadWrite
  item: T
}

export interface IAsset {
  id : string
  name: string
  description ?: string
  owner : string
  restriction : Restricition 
  restrictedContent : any
}

export class Asset extends ObjectType implements IAsset {
  id: string;  name: string;
  description?: string;
  owner: string;
  restriction: Restricition;
  restrictedContent : any
}