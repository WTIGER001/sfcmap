import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Asset } from '../models';
import { DataService } from '../data.service';
import { map, mergeMap, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseGuard implements CanActivate, Resolve<Asset> {
  constructor(private data: DataService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return true;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Asset | Observable<Asset> | Promise<Asset> {
    console.log("RESOLVING ", route.url);

    const url = route.url
    const gameid = route.paramMap.get("gameid")
    const gs = route.paramMap.get("gsid")
    const id = route.paramMap.get("id")

    if (gameid) {
      console.log("SETTING GAME ", route.url);

      this.data.setCurrentGame(gameid)
    }

    if (gameid && id && url.length >= 4) {
      const type = url[2].path
      console.log("GETTING ITEM ", type, id);


      return this.data.game.pipe(
        take(1),
        mergeMap(game => this.data.gameAssets[type].items$),
        take(1),
        map((items: Asset[]) => items.find(i => { return i.id == id })),
      )
    }

    return null
  }

}