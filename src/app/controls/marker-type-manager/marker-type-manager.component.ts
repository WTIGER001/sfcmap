import { Component, OnInit } from '@angular/core';
import { MapType, Category, MarkerType, MarkerCategory } from '../../models';
import { MapService } from '../../maps/map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';
import { Observable, ReplaySubject } from 'rxjs';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { Format } from 'src/app/util/format';

@Component({
  selector: 'app-marker-type-manager',
  templateUrl: './marker-type-manager.component.html',
  styleUrls: ['./marker-type-manager.component.css']
})
export class MarkerTypeManagerComponent implements OnInit {
  edit = false
  isCollapsed = {}
  selected
  filter = ''
  filtered: Category[] = []
  categories: Category[] = []
  sType: string
  folders : MarkerCategory[] = []
  markers : MarkerType[] = []

  constructor(private mapSvc: MapService, private cd: CommonDialogService, private data: DataService, private activeModal : NgbActiveModal) {
    this.data.gameAssets.markerCategories.items$.pipe(
      tap(items => this.folders = items.sort((a, b) => a.name > b.name ? 1 : -1))
    ).subscribe()
    this.data.gameAssets.markerTypes.items$.pipe(
      tap( items => this.markers = items.sort( (a,b) => a.name > b.name ? 1 : -1))
    ).subscribe()

  }

  ngOnInit() {
  }

  editStart() {
    this.edit = true
  }

  cancel() {
    this.edit = false
    this.selected = undefined
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

  delete() {
    if (this.sType == 'cat') {
      const types = this.markers.filter( m => m.category == this.selected.id)
      if (types.length > 0) {
        this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to access the markers in this category any longer. Don't worry existing markers will continue to work.", "Confirm Delete").subscribe(
          r => {
            if (r) {
              this.data.delete(this.selected)
              this.edit = false
            }
          }
        )
      } else {
        this.data.delete(this.selected)
      }
    } else {
      this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to display markers of this type.", "Confirm Delete").subscribe(
        r => {
          if (r) {
            this.data.delete(this.selected)
            this.edit = false
          }
        }
      )
    }
  }

  newMarkerCategory() {
    this.edit = true
    this.sType = 'cat'

    let item = new MarkerCategory()
    item.owner = this.data.game.getValue().id
    item.id = UUID.UUID().toString()
    item.name = Format.nextString("New Category", this.folders.map(f => f.name))
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
      this.edit = true

      let item = new MarkerType()
      item.owner = this.data.game.getValue().id
      item.id = UUID.UUID().toString()
      item.category = cat
      item.name = item.name = Format.nextString("New Marker", this.markers.map(f => f.name))

      item.iconSize = [0, 0]

      this.selected = item
    }
  }

  save() {
    this.edit = false
    if (this.sType == 'cat') {
      // this.data.saveMarkerCategory(this.selected)
      this.data.save(this.selected)
    } else {
      this.selected.iconSize = this.split(this.selected.iconSize)
      this.selected.iconAnchor = this.split(this.selected.iconAnchor)
      this.data.saveMakerType(this.selected)
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
    this.edit  = true
  }

  setFolder(t) {
    this.selected = t
    this.sType = 'cat'
    this.edit = true
  }

  drop(item: MarkerType | Category, cat: Category) {
    if (this.isMarkerType(item) && item.category != cat.id) {
      item.category = cat.id
      // this.data.saveMarkerType(item)
      this.data.save(item)
    } else if (this.isCategory(item) && item.id != cat.id) {
      item.types.forEach(t => {
        t.category = cat.id
        // this.data.saveMarkerType(t)
        this.data.save(t)
      })
    }
  }


  isMarkerType(item: any): item is MarkerType {
    return item.hasOwnProperty('category')
  }

  isCategory(item: any): item is Category {
    return item.hasOwnProperty('types')
  }


  close() {
    this.activeModal.dismiss()
  }


  public static openDialog(modal : NgbModal) {
    const d = modal.open(MarkerTypeManagerComponent)


  }
}
