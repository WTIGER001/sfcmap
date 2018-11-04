import { Distance, BarrierAnnotation } from "../models";
import { DistanceUnit } from "../util/transformation";
import { Points } from "../util/geom";
import { DetectorEmitter } from "./light-source";
import { AuraVisible } from "../models/aura";

/*
NOT DONE
*/

export class Emitter {
  id: string
  name: string
  range: Distance
  emissionTypes: string[] = []
  angleStart: number = 0
  angleEnd: number = 2 * Math.PI
  location: [number, number]
  enabled: boolean
  visible: AuraVisible = AuraVisible.NotVisible
}

export class Detector {
  id: string
  enabled: boolean
  range: Distance
  visible: AuraVisible = AuraVisible.NotVisible
  name: string
  emissionTypes: string[] = []
  angleStart: number = 0
  angleEnd: number = 2 * Math.PI
  enhancement = 1.0
  location: [number, number]
}

export class Detection {

  constructor(
    private emitter: Emitter,
    private detector: Detector) { }
}


export class DetectionManager {

  constructor() {

  }


}

export class DetectionUtil {
  public static determineDetections(emitters: Emitter[], detectors: Detector[], barriers: BarrierAnnotation[]): Detection[] {
    const rtn: Detection[] = []

    detectors.forEach(d => {
      rtn.push(... this.checkDetector(d, emitters, barriers))
    })

    return rtn
  }

  public static checkDetector(detector: Detector, emitters: Emitter[], barriers: BarrierAnnotation[]): Detection[] {
    const rtn: Detection[] = []

    emitters.forEach(e => {
      if (this.checkDetectorEmitter(detector, e, barriers)) {
        rtn.push(new Detection(e, detector))
      }
    })

    return rtn
  }

  public static checkDetectorEmitter(detector: Detector, emitter: Emitter, barriers: BarrierAnnotation[]): boolean {
    // Calculate the real distance between the detector and emitter
    const distance = Points.distance(emitter.location, detector.location)

    // Calculate the effective range of the detector
    const range = Distance.toMeters(detector.range) * detector.enhancement

    // determine if the angles match up
    //TODO: Make the angular checks

    // Quick check. If by now the detector is not within range then there is no chance of a detection
    if (distance > range) {
      return false
    }

    // determine if there are any barriers in the way and modify the distance for the transmission of the barrier. Multiple barriers have a linear effect.
    const barrierHits = this.checkBarriers(detector, emitter, barriers)
    let effectiveDistance = distance
    barrierHits.forEach(b => {
      effectiveDistance = effectiveDistance * b.transmission
    })

    // Now determine if the effective distance is within the range
    return effectiveDistance <= range
  }

  public static checkBarriers(detector: Detector, emitter: Emitter, barriers: BarrierAnnotation[]): BarrierAnnotation[] {
    const rtn: BarrierAnnotation[] = []

    barriers.forEach(b => {
      if (this.checkBarrier(detector, emitter, b)) {
        rtn.push(b)
      }
    })

    return rtn
  }

  public static checkBarrier(detector: Detector, emitter: Emitter, barrier: BarrierAnnotation): boolean {

    for (let i = 0; i < barrier.points.length - 1; i++) {
      if (Points.instersects(
        detector.location[0], detector.location[1],
        emitter.location[0], emitter.location[1],
        barrier.points[i][0], barrier.points[i][1],
        barrier.points[i + 1][0], barrier.points[i + 1][1])
      ) {
        return true;
      }
    }
    return false
  }

}