import { Distance } from "../models";


export enum EmissionType {
  light,
  darkness,
  magic, 
  good, 
  chaos,
  evil, 
  law,
  undead,
  living,
  invisible
}

export interface IDetectorEmitter {
  angleStart: number
  angleEnd: number
  range: Distance
  rangeDim: Distance
  emits: string[]
  detects: string[]
  color: string
  scaleFactor: number
}

export class DetectorEmitter implements IDetectorEmitter {
  angleStart = 0
  angleEnd = 360
  range: Distance
  rangeDim: Distance
  emits: string[] = []
  detects: string[] = []
  color: string = '#ffffffAA'
  scaleFactor = 1
}