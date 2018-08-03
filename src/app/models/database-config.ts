import { User, UserAssumedAccess, MapPrefs, Prefs } from "./user";
import { Annotation } from "./annotations";
import { MapType } from "./map-type";
import { MapConfig } from "./map-config";
import { MarkerType } from "./marker-type";
import { MarkerCategory } from "./marker-category";
import { UserGroup } from "./user-group";
import { ChatRecord } from "./chat";
import { error } from "util";
import { MarkerGroup } from "./annotation-group";

export class DbConfig {

  static dbPath(obj: any): string {
    console.log("dbPath ", obj);

    // Users
    if (User.is(obj)) { return User.FOLDER + "/" + obj.uid }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.FOLDER + "/" + obj.uid }
    if (MapPrefs.is(obj)) { return MapPrefs.FOLDER + "/" + obj.uid }
    if (Prefs.is(obj)) { return Prefs.FOLDER + "/" + obj.uid }

    // Reference level data
    if (MapType.is(obj)) { return MapType.FOLDER + "/" + obj.id }
    if (MapConfig.is(obj)) { return MapConfig.FOLDER + "/" + obj.id }
    if (MarkerType.is(obj)) { return MarkerType.FOLDER + "/" + obj.id }
    if (MarkerCategory.is(obj)) { return MarkerCategory.FOLDER + "/" + obj.id }
    if (UserGroup.is(obj)) { return UserGroup.FOLDER + "/" + obj.id }

    // Per Map data
    if (Annotation.is(obj)) { return Annotation.FOLDER + "/" + obj.map + "/" + obj.id }
    if (MarkerGroup.is(obj)) { return MarkerGroup.FOLDER + "/" + obj.map + "/" + obj.id }

    // Chat
    if (ChatRecord.is(obj)) { return ChatRecord.FOLDER + "/" + obj.id }

    console.log("dbPath oh shit ", obj);

    throw new error("Unable to calculate db path: Invalid Object Type: ", obj)
  }

  static dbFolder(obj: any): string {
    // Users
    if (User.is(obj)) { return User.FOLDER }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.FOLDER }
    if (MapPrefs.is(obj)) { return MapPrefs.FOLDER }
    if (Prefs.is(obj)) { return Prefs.FOLDER }

    // Reference level data
    if (MapType.is(obj)) { return MapType.FOLDER }
    if (MapConfig.is(obj)) { return MapConfig.FOLDER }
    if (MarkerType.is(obj)) { return MarkerType.FOLDER }
    if (MarkerCategory.is(obj)) { return MarkerCategory.FOLDER }
    if (UserGroup.is(obj)) { return UserGroup.FOLDER }

    // Per Map data
    if (Annotation.is(obj)) { return Annotation.FOLDER + "/" + obj.map }
    if (MarkerGroup.is(obj)) { return MarkerGroup.FOLDER + "/" + obj.map }

    // Chat
    if (ChatRecord.is(obj)) { return ChatRecord.FOLDER }

    throw new error("Unable to calculate db folder: Invalid Object Type: ", obj)
  }

  static toItem(obj: any): any {
    // Users
    if (User.is(obj)) { return User.to(obj) }
    if (UserAssumedAccess.is(obj)) { return UserAssumedAccess.to(obj) }
    if (MapPrefs.is(obj)) { return MapPrefs.to(obj) }
    if (Prefs.is(obj)) { return Prefs.to(obj) }

    // Reference level data
    if (MapType.is(obj)) { return MapType.to(obj) }
    if (MapConfig.is(obj)) { return MapConfig.to(obj) }
    if (MarkerType.is(obj)) { return MarkerType.to(obj) }
    if (MarkerCategory.is(obj)) { return MarkerCategory.to(obj) }
    if (UserGroup.is(obj)) { return UserGroup.to(obj) }

    // Per Map data
    if (Annotation.is(obj)) { return Annotation.to(obj) }
    if (MarkerGroup.is(obj)) { return MarkerGroup.to(obj) }

    // Chat
    if (ChatRecord.is(obj)) { return ChatRecord.to(obj) }

    throw new error("Unable to calculate db folder: Invalid Object Type: ", obj)
  }

  static prepareForSave(obj: any) {

  }

}