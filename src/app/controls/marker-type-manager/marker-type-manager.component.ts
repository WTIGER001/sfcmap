import { Component, OnInit } from '@angular/core';
import { MapType, Category, MarkerType, MarkerCategory } from '../../models';
import { MapService } from '../../maps/map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';
import { Observable, ReplaySubject } from 'rxjs';

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

  constructor(private mapSvc: MapService, private cd: CommonDialogService, private data: DataService) {
    this.data.categories.subscribe(categories => {
      this.categories = categories
      categories.forEach(c => {
        if (!this.isCollapsed.hasOwnProperty(c.name)) {
          this.isCollapsed[c.name] = true
        }
      })
      this.applyFilter()
    })
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
      if (this.selected.types.length > 0) {
        this.cd.confirm("Are you sure you want to delete " + this.selected.name + "? If you do then you will not be able to access the markers in this category any longer. Don't worry existing markers will continue to work.", "Confirm Delete").subscribe(
          r => {
            if (r) {
              this.data.delete(this.selected)
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
          }
        }
      )
    }
  }

  newMarkerCategory() {
    this.edit = true
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
      this.edit = true

      let item = new MarkerType()
      item.id = UUID.UUID().toString()
      item.category = cat
      item.name = "New Type"
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
      // this.data.saveMarkerType(this.selected)
      this.data.save(this.selected)
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

}
