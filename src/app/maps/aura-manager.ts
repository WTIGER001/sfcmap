import { MapService } from "./map.service";
import { DataService } from "../data.service";
import { ChangeDetectorRef } from "@angular/core";
import { TokenAnnotation, Character, Distance, Selection } from "../models";
import { Aura, AuraVisible } from "../models/aura";
import { Circle, circle, LatLng, CircleMarkerOptions } from "leaflet";
import { LangUtil } from "../util/LangUtil";
import { filter, tap, pairwise } from "rxjs/operators";

export class AuraManager {
  sel : Selection = new Selection([])
  constructor(private mapSvc : MapService, private data : DataService) {
    this.mapSvc.annotationAddUpate.pipe(
      filter( a => TokenAnnotation.is(a)),
      tap( a=> this.updateAuras(<TokenAnnotation>a))
    ).subscribe()

    this.mapSvc.selection.pipe(
      pairwise(),
      tap( items => this.processSelection(items))
    ).subscribe()
  }

  processSelection( [ a, b] ) {
    const last : Selection = a
    const current : Selection = b

    if (last) {
      this.deselect(last.items.filter(an => TokenAnnotation.is(an)))
    }
    if (current) {
      this.sel = new Selection(current.items.slice(0))
      this.select(current.items.filter(an => TokenAnnotation.is(an)))
    }
  }

  deselect(items : TokenAnnotation[]) {
    items.forEach( item => {
      item.auras.forEach( aura => {
        let auraShp = this.findAura(item, aura)
        if (auraShp && (aura.visible === AuraVisible.OnSelect)) {
          auraShp.remove()
        }
      })
    })
  }

  select(items: TokenAnnotation[]) {
    items.forEach(item => {
      item.auras.forEach(aura => {
        let auraShp = this.findAura(item, aura)
        if (!auraShp && (aura.visible === AuraVisible.OnSelect)) {
          this.updateAura(item, aura)
        }
      })
    })
  }

  updateAuras(item: TokenAnnotation) {
    item.auras.forEach( a => {
      this.updateAura(item, a)
    })
  }

  updateAura(item: TokenAnnotation,  aura : Aura) {
    const  selected = this.sel.items.findIndex( i => i.id == item.id) >= 0

    // Determine if we already have an aura circle drawn
    let auraShp = this.findAura(item, aura)

    if (auraShp) {
      auraShp.remove()
    } 

    if (aura.visible === AuraVisible.NotVisible) {
      // console.log("Not visibile so skipping")
      return
    }
    if (aura.visible === AuraVisible.OnSelect && !selected) {
      // console.log("Not selected so skipping")
      return
    }

    // Convert distance to a radius
    const ppm = this.mapSvc._mapCfg.ppm
    const radiusM = Distance.toMeters(aura.radius)
    const radius = radiusM

    // Get the location
    const center: LatLng = this.getCenter(item)

    // Construct the options
    const opts : CircleMarkerOptions =  {}
    opts.radius=  radius
    opts.stroke = aura.border
    opts.color = LangUtil.baseColor(aura.color)
    opts.weight = aura.weight 
    opts.opacity = LangUtil.colorAlpha(aura.color)
    opts.color = aura.color
    opts.fill=  aura.fill
    opts.fillColor =  LangUtil.baseColor(aura.fillColor)
    opts.fillOpacity = LangUtil.colorAlpha(aura.fillColor)
    opts.pane = "aura"
    opts.interactive = false
    
    auraShp = circle(center, opts)
    auraShp.addTo(this.mapSvc._map)

    // Store the item and the aura in the layer so that we can find them later. If this gets too slow
    // then we will have to use a map
    auraShp["_objAttach"] = item
    auraShp["_auraAtach"] = aura
  }

  findAura(item: TokenAnnotation, aura : Aura) : Circle {
    let found : Circle

    this.mapSvc._map.eachLayer(l => {
      if (l instanceof Circle) {
        const attToken = l["_objAttach"]
        const attAura = l["_auraAtach"]
        if (attToken && attAura && attToken.id === item.id && attAura.id == aura.id) {
          found = l
        }
      } 
    })
    return found
  }

  getCenter(token : TokenAnnotation) : LatLng {
    return token.center()
  }
}