import { MapService } from "./map.service";
import { DataService } from "../data.service";
import { tap, filter } from "rxjs/operators";
import { MapConfig, BarrierAnnotation, Annotation } from "../models";
import { FeatureGroup, featureGroup, LatLng, latLng, polyline } from "leaflet";
import { NgZone } from "@angular/core";


export class LightingManager {
  mapCfg: MapConfig;
  lightlayer : FeatureGroup
    
  constructor( private mapSvc : MapService, private data : DataService, private zone : NgZone) {
    console.log("_____________________Lighting Manager Constructor")

    this.mapSvc.mapConfig.pipe(
      tap(m => console.log('_____________________Recieved new map')),
      tap( m => this.mapCfg = m),
    ).subscribe()

    this.data.gameAssets.maps.items$.pipe(
      tap(m => console.log('_____________________Recieved new Maps from DB')),
      filter(m => this.mapSvc._mapCfg != undefined),
      tap(maps => maps.find( m=> m.id == this.mapSvc._mapCfg.id)),
    ).subscribe()

    this.mapSvc.annotationAddUpate.pipe(
      tap(m => console.log('_____________________Recieved new annotation from DB')),
      filter(m => this.mapSvc._mapCfg != undefined),
      filter(a => BarrierAnnotation.is(a)),
      tap(a => this.addUpdateBarrier(<BarrierAnnotation>a))
    )

    this.mapSvc.annotationDelete.pipe(
      tap(m => console.log('_____________________Recieved deleted annotation from DB')),
      filter(m => this.mapSvc._mapCfg != undefined),
      filter(a => BarrierAnnotation.is(a)),
      tap(a => this.deletedBarrier(<BarrierAnnotation>a))
    )
  }
  
  initLayer() {
    if (!this.lightlayer) {
      const map = this.mapSvc._map

      this.lightlayer = featureGroup()
      this.lightlayer.setZIndex(900)

      this.lightlayer.on('click', this.onAnnotationClick, this)

      if (map) {
        this.lightlayer.addTo(map)
      }
    }
  }


  private onAnnotationClick(event: any) {
    this.zone.run(() => {
      const leafletItem = event.layer
      const annotation = <Annotation>leafletItem.objAttach
      if (event.originalEvent.ctrlKey) {
        this.mapSvc.addToSelect(annotation)
      } else {
        this.mapSvc.selectForEdit(annotation)
      }
    })
  }

  addUpdateBarrier(a : BarrierAnnotation) {
    this.initLayer()
    if (this.mapCfg.showLighting) {
      const item = a.toLeaflet()
      item.addTo(this.lightlayer)
    }
  }

  deletedBarrier(a: BarrierAnnotation) {

  }


}