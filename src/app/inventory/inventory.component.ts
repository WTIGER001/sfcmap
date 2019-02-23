import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UserInventory } from '../models';
import { TokenPack } from '../maps/token';
import { CachedItem } from '../cache/cache';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  userinv : UserInventory
  available : CachedItem[] = []

  constructor(private data : DataService) {
    data.userInventory.subscribe(ui => this.userinv = ui)
    data.getTokenPacks$().subscribe( all => this.available = all)
  }

  ngOnInit() {
  }

  checkChange(checked: boolean, item: CachedItem) {
    if (checked) {
      this.userinv.tokenSets.push(item.id)
    } else {
      const indx = this.userinv.tokenSets.findIndex( id => id === item.id)
      if (indx >= 0) {
        this.userinv.tokenSets.splice(indx, 1)
      }
    }

    this.data.save(this.userinv)
  }

  isChecked(item: CachedItem) {
    return this.userinv.tokenSets.includes(item.id)
  }
}
