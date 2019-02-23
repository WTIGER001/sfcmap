import { Component, OnInit } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { Router } from '@angular/router';
import { RouteUtil } from 'src/app/util/route-util';
import { Location } from '@angular/common';
import { NewMapWizard } from '../NewMapWizard';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-new-map-wizard',
  templateUrl: './new-map-wizard.component.html',
  styleUrls: ['./new-map-wizard.component.css']
})
export class NewMapWizardComponent implements OnInit {
  wizard : string
  page : any
  pages = []
  map : MapConfig = new MapConfig()

  pagesImage = [
    {title : "Step 1: Select Map Image", "key":'image'},
    {title : "Step 2: Calibrate Map", "key":'calibrate'},
    {title : "Step 3: Information", "key":'information'},
    {title : "Step 4: Restrictions", "key":'restrictions'},
  ]

  pagesBlank = [
    { title: "Step 1: Dimensions", "key": 'dimensions' },
    { title: "Step 2: Information", "key": 'information' },
    { title: "Step 3: Restrictions", "key": 'restrictions' },
  ]
  constructor(private router: Router, private location : Location, private data : DataService) { }

  ngOnInit() {
  }

  setWizard(wiz : string) {
    if (wiz === 'image') {
       this.pages = this.pagesImage
       this.page = this.pages[0]
    } 
    if (wiz === 'blank') {
      this.pages = this.pagesBlank
      this.page = this.pages[0]
    } 
  }

  setPage(page : any) {
    this.page = page
  }

  nextPage() {
    console.log("NEXT PAGE")
    let indx = this.pages.indexOf(this.page)
    console.log("NEXT PAGE", indx)

    if (indx < 0) {
      indx = 0
    }
    indx += 1

    console.log("NEXT PAGE 2", indx)

    if (indx <= this.pages.length -1) {
      this.page = this.pages[indx] 
    }
    console.log("NEXT PAGE", this.page)
  }

  close() {
    this.location.back()
  }

  canNext(item : any) {
    if (item.canNext) {
      return item.canNext()
    }
    return true;
  }

  canFinish() {
    if (!this.map._IMG && this.wizard=='image') {
      return false
    }
    if (this.map.ppm == 0 || this.map.height <=0 || this.map.width <= 0) {
      return false
    }
    if (!this.map.name || this.map.name.length == 0) {
      return false
    }

    return true
  }

  finish() {
    // Make sure the mandatory information is completed. 
    this.map.owner = this.data.game.getValue().id

    // Save
    if (this.map._IMG) {
      this.data.saveMap(this.map, this.map._IMG.image, this.map._IMG.thumb)
    } else {
      this.data.saveMap(this.map,)
    }

    this.location.back()
  }

  getSelf(): NewMapWizardComponent {
    return this
  }
}
