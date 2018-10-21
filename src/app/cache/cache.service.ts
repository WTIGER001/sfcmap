import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { CachedItem } from './cache';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, concat } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AngularFireStorage , } from 'angularfire2/storage';
import { TwitterAuthProvider_Instance } from '@firebase/auth-types';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { tap, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  
 
  // max-age=31536000
  private inventory: any = new CacheInventory()

  constructor(
    private db : AngularFireDatabase, 
    private auth : AngularFireAuth, 
    private localStorage : LocalStorage, 
    private storage: AngularFireStorage, 
    private httpClient : HttpClient
    ) { 
    // meta : 
    // this.store.ref('').updateMetatdata('cacheControl')
    this.loadInventory()
  }

  getInventory(): CachedItem[] {
    return _.values(this.inventory)
  }

  download(item : CachedItem) : Observable<any>{
    console.log(`CACHE >>> Downloading ${item.path}`)
    return this.httpClient.get(item.url).pipe(
      tap( data => console.log("Recieved some Data")),
      map( data => this.processData(data)),
      tap( data => this.set(item.path, data)),
      tap(data => this.saveToInventory(item))
    )
  }

  storeLocal(path: string, data : any) {
    const item = new CachedItem()
    item.path = path
    item.version = this.version(path)
    item.localChanges = true
    this.set(path, data)
    this.saveToInventory(item)
  }

  saveToInventory(item : CachedItem) {
    this.saveToInventory$(item).subscribe();
  }

  saveToInventory$(item: CachedItem) {
    this.inventory[item.path] = item

    console.log(`Saving in Inventory`, item, this.inventory)
    return this.localStorage.setItem('CacheInventory', this.inventory)
  }

  processData(data) : any {
    console.log("Processing Data")

    // Inflate the data (if compressed)

    // Take the data and create an array out of it. Order does not matter
    const arrData = _.values(data)

    return arrData
  }


  version(path: string): number {

    const item :CachedItem = this.inventory[path]
    if (item) {
      return item.version
    }

    return -2;
  }


  // ------------------------------------------------------------
  // Cache Methods
  // ------------------------------------------------------------
 
  get(id : string) : Observable<any> {
    console.log(`Getting from Cache ${id}`)
    return this.localStorage.getItem(id)
  }

  set(id : string, data : any) {
    console.log(`Setting in Cache ${id}`)
    this.localStorage.setItem(id, data).subscribe();
  }

  delete(id : string) {
    this.localStorage.removeItem(id).subscribe();

  }

  clear() {
    this.localStorage.clear().subscribe(() => { });
    this.inventory = {}
  }

  loadInventory() {
    this.inventory = this.localStorage.getItem('CacheInventory').subscribe( inventory => {
      console.log(`Loading Cache Inventory`, inventory)
      if (inventory == null) {
        this.inventory = new CacheInventory()
        console.log(`Creating New Inventory`, this.inventory)
      } else {
        this.inventory = inventory
      }
    })
  }

}


export class CacheInventory {
  
}