import { Point } from "leaflet";

export enum LightLevel {
  Bright = 5,
  Normal = 4,
  Dim = 3,
  Dark = 2,
  MagicalDark = 1
}

export enum RangeEffect {
  Plus1UpToNormal = 0,
  Minus1,
  SetNormal,
}

export class LightSource {
  id: string
  name: string
  enabled: boolean
  lightType: number // 0 - light, 1 darkness
  magicalLevel: number = -1 // normal (non magical), 0-9 are magical levels
  range: number
  rangeEffect: RangeEffect
  dimRange: number
  dimRangeEffect: RangeEffect
  angleStart = 0
  angleEnd = 360
  color = '#000000FF'
}

export class Vision {
  enabled: boolean = true
  normal: boolean = true
  dark: boolean = true
  lowLight: boolean
  lowLightRange: number
  darkRange: number = 60
  shared: boolean = true
}

export class Barrier {
  name: string = "Wall"
  enabled: boolean = true
  location: Point[]
  border: boolean
  color: string
  weight: number
  style: string
}

export class MapLighting {
  ambientLight = LightLevel.Dark
  clrDark: string = "#000000FF"
  clrDim: string = "#00000069"
  clrNormal: string = "#ffffff01"
  clrBright: string = "#ffffff00"
  clrMagicDark: string = "#000000FF"
}
