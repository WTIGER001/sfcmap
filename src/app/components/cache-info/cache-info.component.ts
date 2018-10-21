import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/cache/cache.service';
import { CachedItem } from 'src/app/cache/cache';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-cache-info',
  templateUrl: './cache-info.component.html',
  styleUrls: ['./cache-info.component.css']
})
export class CacheInfoComponent implements OnInit {
  items: CachedItem[] = []
  constructor(private cache : CacheService, private data : DataService) { }

  ngOnInit() {
    this.items = this.cache.getInventory()


  }



  publish(item : CachedItem) {
    this.data.publishCached(item.path)
  }
}
