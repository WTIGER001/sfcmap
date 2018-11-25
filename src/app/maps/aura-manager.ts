import { MapService } from "./map.service";
import { DataService } from "../data.service";
import { ChangeDetectorRef } from "@angular/core";
import { TokenAnnotation, Character, Distance, Selection } from "../models";
import { Aura, AuraVisible } from "../models/aura";
import { Circle, circle, LatLng, CircleMarkerOptions, Rectangle, Polygon, PolylineOptions, rectangle } from "leaflet";
import { LangUtil } from "../util/LangUtil";
import { filter, tap, pairwise } from "rxjs/operators";
import { BoundsUtil } from "../util/geom";
import { DistanceUnit } from "../util/transformation";

export class AuraManager {
  sel : Selection = new Selection([])
  constructor(private mapSvc : MapService, private data : DataService) {
    this.mapSvc.annotationAddUpate.pipe(
      filter( a => TokenAnnotation.is(a)),
      tap(a => this.updateToken(<TokenAnnotation>a, this.isSelected(a)))
    ).subscribe()

    this.mapSvc.selection.pipe(
      pairwise(),
      tap( items => this.processSelection(items))
    ).subscribe()

    this.mapSvc.hovering.pipe(
      tap(item => this.processHover(item))
    ).subscribe()
  }

  processHover(hoverItem : any) {
    const selected = this.sel.items.findIndex(i => i.id == hoverItem.item.id) >=0
    this.updateToken(hoverItem.item, this.isSelected(hoverItem.item), hoverItem.hover)
  }

  isSelected(item : any) : boolean {
    return this.sel.items.findIndex(i => i.id == item.id) >= 0
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
       this.updateToken(item, false)
    })
  }

  select(items: TokenAnnotation[]) {
    items.forEach(item => {
      this.updateToken(item, true)
    })
  }

  updateToken(item: TokenAnnotation, selected : boolean, hovering ?: boolean) {
    item.auras.forEach( aura => {
      this.updateAura(item, aura, selected, hovering)
    })
    this.updateReach(item, selected, hovering)
    this.updateMovement(item, selected, hovering)
  }

  findLayer(item: TokenAnnotation, id : string): any {
    let found: any
    this.mapSvc._map.eachLayer(l => {
      const attToken = l["_objAttach"]
      const attAura = l["_auraId"]
      if (attToken && attAura && attToken.id === item.id && attAura == id) {
        found = l
      }
    })
    return found
  }

  updateReach(item: TokenAnnotation, selected: boolean, hovering?: boolean) {
    // Create and display or hide an aura 
    let reachShp = this.findLayer(item, 'reach')
    if (reachShp) {
      console.log("Found Reach Shape and Removing")
      reachShp.remove()
    }

    if (item.reach && item.reach > 0 && this.shouldDraw(item, item.showReach, selected, hovering)) {
      console.log("Creating Reach Shape")
      const bounds = item.asItem().getBounds()
      const reachBounds = BoundsUtil.buffer(bounds, item.reach, DistanceUnit.Feet)

      // Construct the options
      const opts: PolylineOptions = {}
      opts.stroke = true
      opts.color = '#444444'
      opts.weight = 4
      opts.opacity = 1
      opts.dashArray = "8"
      opts.fill = false
      opts.pane = "aura"
      opts.interactive = false

      reachShp = rectangle(reachBounds, opts)
      reachShp.addTo(this.mapSvc._map)
      reachShp["_objAttach"] = item
      reachShp["_auraId"] = 'reach'
    } 
  }

  updateMovement(item: TokenAnnotation, selected: boolean, hovering?: boolean) {
    
  }


  updateAura(item: TokenAnnotation, aura: Aura, selected: boolean, hovering ?: boolean) {
    // Determine if we already have an aura circle drawn
    let auraShp = this.findAura(item, aura)
    if (auraShp) {
      auraShp.remove()
    } 

    if (!this.shouldDraw(item, aura.visible, selected, hovering)) {
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
    opts.dashArray = aura.style
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

  shouldDraw(item: TokenAnnotation, visible : AuraVisible, selected : boolean, hovering  ?: boolean) : boolean {
    if (visible == AuraVisible.NotVisible) {
       return false;
    }
    if (visible == AuraVisible.Visible) {
      return true;
    }
    if ((visible == AuraVisible.OnSelect || visible == AuraVisible.OnHover) && selected) {
     return true
    }
    if (visible == AuraVisible.OnHover && hovering) {
      return true
    }
    return false
  }
}