import { DataService } from "../../data.service";
import { ObjectType, MarkerCategory, MapType } from "../../models";
import { DbConfig } from "../../models/database-config";

export class DebugUtils {

  constructor(private data: DataService) {

  }

  public fixAllObjectTypes() {
    this.fixObjectTypes(new MapType())
  }


  public fixObjectTypes(item: ObjectType) {
    console.log("Fixing Object Types");

    const folder = DbConfig.dbFolder(item)
    console.log("Fixing Object Types in ", folder);

    let sub = this.data.db.list(folder).valueChanges().subscribe(
      items => {
        console.log("Got some to fix ", items);
        items.forEach(it => {
          item.copyFrom(it)
          this.data.save(item)
        })
      }
    )
  }


}