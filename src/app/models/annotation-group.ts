import { IRestrictedItem, IDbItem, IObjectType, ObjectType, Asset } from "./core";
import { Annotation } from "./annotations";
import { FeatureGroup, Map, Layer, featureGroup } from "leaflet";

export class MarkerGroup extends Asset  {
  public static readonly TYPE = 'db.MarkerGroup'
  public static readonly FOLDER = 'annotationGroups'
  public static readonly SAMPLE = {
    objType: '',
    id: 'string',
    name: 'string',
    description: 'string',
    map: 'string',
    edit: [],
    view: [],
  }

  // TypeScript guard
  static is(obj: any): obj is MarkerGroup {
    return obj.objType !== undefined && obj.objType === MarkerGroup.TYPE
  }

  static to(obj: any): MarkerGroup {
    return new MarkerGroup().copyFrom(obj)
  }

  dbPath(): string {
    return MarkerGroup.FOLDER + '/' + this.map + "/" + this.id
  }

  readonly objType: string = MarkerGroup.TYPE
  id: string
  name: string
  description: string

  /**
   * The id of the map that this group is associated to
   */
  map: string
  edit: string[]
  view: string[]
  showText: boolean = false
  textStyle: string = 'sfc-tooltip-default'
  _annotations: Annotation[] = []
  _leafletAttachment: FeatureGroup

  public setAttachment(item: any) {
    this._leafletAttachment = item
    this._leafletAttachment['title'] = this.name
    this._leafletAttachment['objAttach'] = this
    this._leafletAttachment['sfcId'] = this.id
  }

  public getAttachment(): any {
    return this._leafletAttachment
  }

  toLeaflet(): FeatureGroup {
    if (!this._leafletAttachment) {
      this.setAttachment(featureGroup())
    }
    return this._leafletAttachment
  }

  static fromLeaflet(layer: Layer): MarkerGroup {
    return layer['objAttach']
  }

  static findInLeaflet(map: Map, id: string): MarkerGroup {
    let result = undefined
    map.eachLayer(layer => {
      let sfcId = layer['sfcId']
      if (sfcId && sfcId == id) {
        result = this.fromLeaflet(layer)
      }
    })
    return result
  }
}

