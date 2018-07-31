import { Map as LeafletMap, LatLng, Handler, LeafletMouseEvent, marker, icon, latLng } from "leaflet";
import { MapService } from "../map.service";
import { AudioService, Sounds } from "../audio.service";
import { PingMessage } from "../models";
import { MessageService } from "../message.service";

/**
 * Ping creates a ping for users to see where the other users are pointing. This works by 
 * creating a mouse listener on the map and on a long press the ping is fired. Once fired
 * the ping creates a temporary SVG annotation on the map that is animated. The ping fires
 * an event off to the firebase database and then deletes that item after a few seconds. 
 * The client that recieves the event and shows the ping (and maybe plays the ping sound).
 * 
 */
export class Ping {
  point: LatLng
  startTime: number;
  timeoutHandle: any

  constructor(private _map: LeafletMap, private audio: AudioService, private msg: MessageService) {
    this.msg.onPing$().subscribe(rec => {
      console.log("Recieved Ping!--- IN PING", rec);
      this.triggerPing(<PingMessage>rec.record)
    })
  }

  get map(): LeafletMap {
    return this['_map']
  }

  addHooks() {
    this.map.on('mousedown', this.start, this);
    this.map.on('mouseup', this.clear, this);
    // this.map.on('mousemove', this.clear, this);
  }

  removeHooks() {
    this.map.off('mousedown', this.start, this);
    this.map.off('mouseup', this.clear, this);
    // this.map.off('mousemove', this.clear, this);
  }

  clear(evt) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle)
    }
  }

  start(evt: LeafletMouseEvent) {
    this.point = evt.latlng
    this.timeoutHandle = setTimeout(() => {
      this.sendPing()
      this.timeoutHandle = undefined
    }, 1000);
  }

  sendPing() {
    let png = new PingMessage()
    png.lat = this.point.lat
    png.lng = this.point.lng
    png.map = this.map['mapcfgid']
    png.mapname = this.map['title']

    this.msg.sendMessage(png)
    // this.triggerPing(png)
  }

  triggerPing(png: PingMessage) {
    console.log("Triggering Ping")
    this.audio.play(Sounds.Beep)
    let ll = latLng(png.lat, png.lng)
    Ping.showFlag(this.map, ll, 10000)
  }

  static showFlag(map: LeafletMap, loc: LatLng, duration: number) {
    let icn = icon({
      iconUrl: "./assets/icons/red-flag.png",
      iconSize: [35, 40],
      iconAnchor: [17, 40]
    })
    let opts = {
      icon: icn
    }
    let m = marker(loc, opts)
    m.addTo(map)
    setTimeout(() => {
      m.remove()
    }, 10000);
  }
}
