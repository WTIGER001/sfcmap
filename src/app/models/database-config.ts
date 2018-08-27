import { User, UserAssumedAccess, MapPrefs, Prefs } from "./user";
import { Annotation } from "./annotations";
import { MapType } from "./map-type";
import { MapConfig } from "./map-config";
import { MarkerType } from "./marker-type";
import { MarkerCategory } from "./marker-category";
import { ChatRecord } from "./chat";
import { error } from "util";
import { MarkerGroup } from "./annotation-group";
import { CharacterType } from "./character-type";
import { Character } from "./character";
import { MonsterIndex, MonsterText } from "./monsterdb";
import { GameSystem } from "./game-system";
import { Game } from "./game";
import { Encounter } from "../encounter/model/encounter";

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


  static restrictableFields(objType: string) {
    if (objType == MapConfig.TYPE) {
      return ["name", "tags"]
    }

    if (objType == Character.TYPE) { return Character.RESTRICTABLE }

    if (objType == MonsterIndex.TYPE) {
      return ['name', 'type', 'cr', "tags"]
    }
    if (objType == Encounter.TYPE) {
      return ['name', "tags"]
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
    if (objType == MonsterIndex.TYPE) {
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
    if (objType == MonsterIndex.TYPE) { return "monsters" }
    // if (objType == MonsterText.TYPE) { return "monstertexs" }
    if (objType == ChatRecord.TYPE) { return "chats" }
    if (objType == Encounter.TYPE) { return "encounters" }
    if (objType == Annotation.TYPE) { return "annotations" }
    if (objType == MarkerGroup.TYPE) { return "annotationGroups" }
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
    if (objType == MonsterIndex.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MonsterIndex.FOLDER }
    if (objType == MonsterText.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MonsterText.FOLDER }
    if (objType == ChatRecord.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + ChatRecord.FOLDER }
    if (objType == Encounter.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Encounter.FOLDER }

    // Map Level Data
    if (objType == Annotation.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + Annotation.FOLDER }
    if (objType == MarkerGroup.TYPE) { return this.ASSET_FOLDER + "/" + parentId + "/" + MarkerGroup.FOLDER }
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

    if (Game.is(obj)) { return Game.to(obj) }
    if (GameSystem.is(obj)) { return GameSystem.to(obj) }

    // Reference level data
    if (MapType.is(obj)) { return MapType.to(obj) }
    if (MapConfig.is(obj)) { return MapConfig.to(obj) }
    if (MarkerType.is(obj)) { return MarkerType.to(obj) }
    if (MarkerCategory.is(obj)) { return MarkerCategory.to(obj) }
    if (CharacterType.is(obj)) { return CharacterType.to(obj) }
    if (Character.is(obj)) { return Character.to(obj) }

    // Per Map data
    if (Annotation.is(obj)) { return Annotation.to(obj) }
    if (MarkerGroup.is(obj)) { return MarkerGroup.to(obj) }

    // Chat
    if (ChatRecord.is(obj)) { return ChatRecord.to(obj) }

    if (MonsterIndex.is(obj)) { return MonsterIndex.to(obj) }
    if (MonsterText.is(obj)) { return MonsterText.to(obj) }

    // Extensions
    for (let i = 0; i < this.extensions.length; i++) {
      if (this.extensions[i].is(obj)) {
        return this.extensions[i].to(obj)
      }
    }
    console.log("Invalid", obj);

    throw new Error(`Unable to calculate db folder: Invalid Object Type: ${obj.objType}`)
  }

  static prepareForSave(obj: any) {

  }
}

