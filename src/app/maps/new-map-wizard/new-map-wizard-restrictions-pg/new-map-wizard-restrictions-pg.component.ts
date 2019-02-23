import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { Assets } from 'src/app/assets';
import { NewMapWizard } from '../NewMapWizard';

@Component({
  selector: 'app-new-map-wizard-restrictions-pg',
  templateUrl: './new-map-wizard-restrictions-pg.component.html',
  styleUrls: ['./new-map-wizard-restrictions-pg.component.css']
})
export class NewMapWizardRestrictionsPgComponent implements OnInit {
  @Input() map: MapConfig
  @Input() wiz: NewMapWizard

  genericThumb = Assets.MapCard
  fowThumb : string

  restriction = 1
  namerestriction = 1
  thumbrestriction = 0

  constructor(private zone : NgZone) { }

  ngOnInit() {
    this.createFowThumb()
  }

  getFowThumbnail() : string {
    return this.fowThumb
  }

  createFowThumb() {
    console.log("Creating Image")

    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = this.map.image

    const canvas = document.createElement('canvas')
    canvas.height = this.map.height
    canvas.width = this.map.width
    const ctx = canvas.getContext("2d")

    img.onload =  () => {
      console.log("image loaded")
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#000000'
      const gapW = 0.2 * canvas.width
      const gapH = 0.2 * canvas.height
      ctx.fillRect(gapW, gapH, canvas.width - (2 * gapW), canvas.height - (2 * gapH))

      this.zone.run(()=> {
        this.fowThumb = canvas.toDataURL()
      })
      console.log("Thumb Set")
      canvas.remove()
    }

  }

  update() {
    
  }
}
