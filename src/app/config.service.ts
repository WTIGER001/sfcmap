import { Injectable } from '@angular/core';
import { debug } from 'util';

/**
 * The Config Service is responsible for accepting and providing the configuration for each extension.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  extensions : Map<string, ISfcExtension> = new Map();
  extArr : ISfcExtension[] = []

  constructor() { }


  registerExtension() {

  }

  registerAsset() {

  }

  to( obj: any) : any {
    if (!obj) {
      throw new Error('Undefined object provided')
    }

    const type : ISfcExtension = this.extArr.find( ext => ext.is(obj))
    if (!type) {
      console.error('Invalid object for to', obj);
      throw new Error('Invalid object... Type not found')
    }

    return type.to(obj)
  } 

  pathFolderTo(objType: string, parentId?: string): string {
    const type: ISfcExtension = this.getExtByName(objType)
    return 'none'
  }

  getExtByName(objType: string): ISfcExtension {
    if (!objType) {
      throw new Error('Undefined object type provided')
    }

    const type: ISfcExtension = this.extArr.find(ext => ext.type == objType)
    if (!type) {
      console.error('Invalid object for ', objType);
      throw new Error('Invalid object... Type not found ' + objType)
    }
    return type
  }

  getExt(obj : any) : ISfcExtension {
    if (!obj) {
      throw new Error('Undefined object provided')
    }

    const type: ISfcExtension = this.extArr.find(ext => ext.is(obj))
    if (!type) {
      console.error('Invalid object for to', obj);
      throw new Error('Invalid object... Type not found')
    }
    return type
  }

}

export interface ISfcExtension {
  name: string
  type : string
  subtype ?:string
  is: (obj: any) => boolean
  to: (obj: any) => any
  folder: (obj: any) => string
  path: (obj: any) => string
  
}
