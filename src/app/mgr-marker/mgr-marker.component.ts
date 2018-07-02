import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonDialogService } from '../dialogs/common-dialog.service';
import { DataService } from '../data.service';
import { MarkerType, MarkerCategory, MapType } from '../models';
import { UUID } from 'angular2-uuid';
import { Observable, ReplaySubject } from 'rxjs';
import { MapService, Category } from '../map.service';

@Component({
  selector: 'app-mgr-marker',
  templateUrl: './mgr-marker.component.html',
  styleUrls: ['./mgr-marker.component.css']
})
export class MgrMarkerComponent implements OnInit {
  isCollapsed = new Map<any, boolean>()
  selected
  filter = ''
  filtered: Category[] = []
  categories: Category[] = []
  sType: string
  mapTypes: MapType[] = []

  constructor(private mapSvc: MapService, private activeModal: NgbActiveModal, private cd: CommonDialogService, private data: DataService) {
    this.mapSvc.catsLoaded.subscribe(v => {
      this.categories = this.mapSvc.categories
      this.applyFilter()
    })
    this.data.mapTypes.subscribe(types => this.mapTypes = types)
  }

  ngOnInit() {
  }

  clearFilter() {
    this.filter = ''
    this.applyFilter()
  }

  filterUpdate(event) {
    this.filter = event
    this.applyFilter()
  }

  applyFilter() {
    if (this.filter && this.filter.length > 0) {
      let searchFor = this.filter.toLowerCase()
      let items = []
      this.categories.forEach(cat => {
        let newCat = new Category()
        newCat.id = cat.id
        newCat.appliesTo = cat.appliesTo
        newCat.name = cat.name
        newCat.types = []

        cat.types.forEach(t => {
          if (t.name.toLowerCase().includes(searchFor)) {
            newCat.types.push(t)
          }
        })

        if (newCat.types.length > 0 || newCat.name.toLowerCase().includes(searchFor)) {
          items.push(newCat)
        }
      })
      this.filtered = items
    } else {
      this.filtered = this.categories
    }
  }


  setFile(event) {
    if (this.selected) {
      let f = event.target.files[0]
      this.selected["__FILE"] = f
      this.getDimensions(f).subscribe(val => {
        this.selected.iconSize = val
        this.selected.iconAnchor = [Math.round(val[0] / 2), val[1]]
      })
      console.log("FILE")
      console.log(this.selected["__FILE"]);
    }
  }

  getDimensions(f: File): Observable<[number, number]> {
    let val = new ReplaySubject<[number, number]>()
    let reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onloadend = function () {
      var url = reader.result
      var img = new Image()
      img.src = url
      img.onload = function () {
        val.next([img.width, img.height])
      }
    }
    return val
  }


  delete() {
    if (this.sType == 'cat') {
      if (this.selected.types.length > 0) {
        this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to access the markers in this category any longer. Don't worry existing markers will continue to work.", "Confirm Delete").subscribe(
          r => {
            if (r) {
              this.data.deleteMarkerCategory(this.selected)
            }
          }
        )
      } else {
        this.data.deleteMarkerCategory(this.selected)
      }
    } else {
      this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to display markers of this type.", "Confirm Delete").subscribe(
        r => {
          if (r) {
            this.data.deleteMarkerType(this.selected)
          }
        }
      )
    }
  }

  newMarkerCategory() {
    this.sType = 'cat'

    let item = new MarkerCategory()
    item.id = UUID.UUID().toString()
    item.name = "New Category"
    this.selected = item
  }

  newMarkerType() {
    if (this.selected) {
      let cat = ''
      if (this.sType == 'cat') {
        cat = this.selected.id
      } else {
        cat = this.selected.category
      }

      this.sType = 'type'

      let item = new MarkerType()
      item.id = UUID.UUID().toString()
      item.category = cat
      item.name = "New Type"

      this.selected = item
    }
  }


  save() {
    console.log("SAVING");
    console.log(this.selected);

    if (this.sType == 'cat') {
      this.data.saveMarkerCategory(this.selected)
    } else {
      this.selected.iconSize = this.split(this.selected.iconSize)
      this.selected.iconAnchor = this.split(this.selected.iconAnchor)
      this.data.saveMarkerType(this.selected)
    }
  }

  split(item: any): [number, number] {
    if (typeof (item) == 'string') {
      let items = item.split(",")
      let lat = +items[0]
      let lng = +items[1]
      return [lat, lng]
    } else {
      return item
    }
  }

  setType(t) {
    this.selected = t
    this.sType = 'type'
  }
  setCat(t) {
    this.selected = t
    this.sType = 'cat'
  }
}
