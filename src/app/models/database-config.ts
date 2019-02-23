import { User, UserAssumedAccess, MapPrefs, Prefs, UserInventory } from "./user";
import { Annotation, TokenAnnotation } from "./annotations";
import { MapType } from "./map-type";
import { MapConfig } from "./map-config";
import { MarkerType } from "./marker-type";
import { MarkerCategory } from "./marker-category";
import { ChatRecord } from "./chat";
import { error } from "util";
import { MarkerGroup } from "./annotation-group";
import { CharacterType } from "./character-type";
import { Character } from "./character";
import { GameSystem } from "./game-system";
import { Game } from "./game";
import { Encounter } from "../encounter/model/encounter";
import { Item } from "../items/item";
import { Monster } from "../monsters/monster";
import { Token } from "../maps/token";
import { FogOfWar } from "../maps/fow";

interface DbItem {
  name: string
  is: (obj: any) => boolean
  to: (obj: any) => any
  folder: (obj: any) => string
  path: (obj: any) => string
}

export class DbConfig {

  public static readonly ASSET_FOLDER = "assets"
  static extensions: DbItem[] = []

  static register(name: string, is: (obj: any) => boolean,
    to: (obj: any) => any,
    folder: (obj: any) => string,
    path: (obj: any) => string) {

    this.extensions.push({ name, is, to, folder, path })
  }


  static restrictableFields(item : any) {
    if (MapConfig.is(item)) {
      return ["name", "tags"]
    }

    if (Character.is(item)) { return Character.RESTRICTABLE }

    if (Monster.is(item)) {
      return Monster.RESTRICT
    }

    if (TokenAnnotation.is(item)) {
      return ['Name', 'Bars', 'Personal', 'Auras', 'Light', 'Rolls', 'Stats']
    }
    return ['name', "tags"]
  }

  static queryFields(objType: string) {
    if (objType == MapConfig.TYPE) {
      return ["name", "tags"]
    }
    if (objType == Character.TYPE) {
      return ["name", "type", "race", "tags"]
    }
    if (objType == Monster.TYPE) {
      return ['name', 'type', 'cr', "tags"]
    }
    if (objType == Encounter.TYPE) {
      return ['name', "tags"]
    }
    return ['name', "tags"]
  }


  static safeTypeName(name: string) {
    return name.replace('.', '_')
  }

  static key(objType: string): any {
    if (objType == MapType.TYPE) { return "mapTypes" }
    if (objType == MapConfig.TYPE) { return "maps" }
    if (objType == MarkerType.TYPE) { return "markerTypes" }
    if (objType == MarkerCategory.TYPE) { return "markerCategories" }
    if (objType == CharacterType.TYPE) { return "characterTypes" }
    if (objType == Character.TYPE) { return "characters" }
    if (objType == Monster.TYPE) { return "monsters" }
    if (objType == FogOfWar.TYPE) { return "fow" }
    
    // if (objType == MonsterText.TYPE) { return "monstertexs" }
    if (objType == ChatRecord.TYPE) { return "chats" }
    if (objType == Encounter.TYPE) { return "encounters" }
    if (objType == Annotation.TYPE) { return "annotations" }
    if (objType == MarkerGroup.TYPE) { return "annotationGroups" }
    if (objType == Item.TYPE) { return "items" }
  }

  static pathFolderTo(objType: string, parentId?: string): string {

    // Users
    if (objType == User.TYPE) { return User.FOLDER }
    if (objType == UserAssumedAccess.TYPE) { return UserAssumedAccess.FOLDER }
    if (objType == MapPrefs.TYPE) { return MapPrefs.FOLDER }
    if (objType == Prefs.TYPE) { return Prefs.FOLDER }

    // Game Level
    if (objType == Game.TYPE) { return Game.FOLDER }

    // Game level data
    if (objType == MapType.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MapType.FOLDER }
    if (objType == MapConfig.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MapConfig.FOLDER }
    if (objType == MarkerType.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MarkerType.FOLDER }
    if (objType == MarkerCategory.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MarkerCategory.FOLDER }
    if (objType == CharacterType.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + CharacterType.FOLDER }
    if (objType == Character.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Character.FOLDER }
    if (objType == Monster.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Monster.FOLDER }
    if (objType == ChatRecord.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + ChatRecord.FOLDER }
    if (objType == Encounter.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Encounter.FOLDER }
    if (objType == Item.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Item.FOLDER }
    if (objType == Token.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Token.FOLDER }

    // Map Level Data
    if (objType == Annotation.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Annotation.FOLDER }
    if (objType == MarkerGroup.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MarkerGroup.FOLDER }
    if (objType == FogOfWar.TYPE) { return `${this.ASSET_FOLDER}/${parentId}/${FogOfWar.FOLDER}` }
  
    console.log("Invalid pathFolderTo", objType);

    throw new Error(`Unable to calculate db Folder: Invalid Object Type: ${objType} and  ${parentId}`)
  }

  static pathTo(objType: string, parentId: string, myId?: string): string {
    const folder = this.pathFolderTo(objType, parentId)
    if (folder) {
      return myId ? folder + "/" + myId : folder
    }



    console.log("Invalid pathTo", objType);

    throw new Error(`Unable to calculate db path: Invalid Object Type: ${objType}`)
  }

  static dbPath(obj: any): string {
    // Users
    if (User.is(obj)) { return User.FOLDER + "/" + obj.id }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.FOLDER + "/" + obj.id }
    if (MapPrefs.is(obj)) { return MapPrefs.FOLDER + "/" + obj.id }
    if (Prefs.is(obj)) { return Prefs.FOLDER + "/" + obj.id }
    if (UserInventory.is(obj)) { return UserInventory.FOLDER + "/" + obj.id }

    if (Game.is(obj)) { return Game.FOLDER + "/" + obj.id }
    if (GameSystem.is(obj)) { return GameSystem.FOLDER + "/" + obj.id }

    // Reference level data
    if (obj.objType && obj.owner) {
      return this.pathTo(obj.objType, obj.owner, obj.id)
    }
    console.log("Invalid", obj);

    throw new Error(`Unable to calculate db path: Invalid Object Type: ${obj.objType}`)
  }

  static dbFolder(obj: any): string {
    // Users
    if (User.is(obj)) { return User.FOLDER }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.FOLDER }
    if (MapPrefs.is(obj)) { return MapPrefs.FOLDER }
    if (Prefs.is(obj)) { return Prefs.FOLDER }
    if (UserInventory.is(obj)) { return UserInventory.FOLDER }
    if (Game.is(obj)) { return Game.FOLDER }
    if (GameSystem.is(obj)) { return GameSystem.FOLDER }

    // Reference level data
    if (obj.objType && obj.owner) {
      return this.pathFolderTo(obj.objType, obj.owner)
    }
    console.log("Invalid", obj);

    throw new Error(`Unable to calculate db folder: Invalid Object Type: ${obj.objType}`)
  }

  static toItem(obj: any): any {
    // Users
    if (User.is(obj)) { return User.to(obj) }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.to(obj) }
    if (MapPrefs.is(obj)) { return MapPrefs.to(obj) }
    if (Prefs.is(obj)) { return Prefs.to(obj) }
    if (UserInventory.is(obj)) { return UserInventory.to(obj)}

    if (Game.is(obj)) { return Game.to(obj) }
    if (GameSystem.is(obj)) { return GameSystem.to(obj) }

    // Reference level data
    if (MapType.is(obj)) { return MapType.to(obj) }
    if (MapConfig.is(obj)) { return MapConfig.to(obj) }
    if (MarkerType.is(obj)) { return MarkerType.to(obj) }
    if (MarkerCategory.is(obj)) { return MarkerCategory.to(obj) }
    if (CharacterType.is(obj)) { return CharacterType.to(obj) }
    if (Character.is(obj)) { return Character.to(obj) }
    if (Item.is(obj)) { return Item.to(obj) }
    if (Token.is(obj)) { return Token.to(obj) }

    // Per Map data
    if (Annotation.is(obj)) { return Annotation.to(obj) }
    if (MarkerGroup.is(obj)) { return MarkerGroup.to(obj) }
    if (FogOfWar.is(obj)) { return FogOfWar.to(obj) }

    // Chat
    if (ChatRecord.is(obj)) { return ChatRecord.to(obj) }
    if (Monster.is(obj)) { return Monster.to(obj) }

    // Extensions
    for (let i = 0; i < this.extensions.length; i++) {
      if (this.extensions[i].is(obj)) {
        return this.extensions[i].to(obj)
      }
    }
    console.log("Invalid", obj);

    console.error(`Unable to convert: Invalid Object Type: ${obj.objType}`, obj)
    throw new Error(`Unable to convert: Invalid Object Type: ${obj.objType}`)
  }

  static prepareForSave(obj: any) {

  }
}

