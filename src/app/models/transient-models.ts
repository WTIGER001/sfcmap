import { MapConfig } from "./map-config";
import { MarkerType } from "./marker-type";


export class MergedMapType {
    id: string
    name: string
    order: number
    defaultMarker: string
    maps: MapConfig[]
}


export class Category {
    appliesTo: string[];
    name: string
    id: string
    types: MarkerType[] = []
}