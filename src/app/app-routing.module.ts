import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditCharacterComponent } from './characters/edit-character/edit-character.component';
import { MonsterComponent } from './monsters/controls/monster/monster.component';
import { MonsterIndexPageComponent } from './monsters/controls/monster-index-page/monster-index-page.component';
import { CharacterIndexComponent } from './characters/controls/character-index/character-index.component';
import { GameIndexComponent } from './game/components/game-index/game-index.component';
import { AdminComponent } from './components/admin/admin.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GameEditComponent } from './game/components/game-edit/game-edit.component';
import { GameViewComponent } from './game/components/game-view/game-view.component';
import { EditMapComponent } from './controls/edit-map/edit-map.component';
import { MapIndexComponent } from './maps/controls/map-index/map-index.component';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'home', redirectTo: '/games', pathMatch: 'full' },
  // { path: 'map', component: MapComponent },
  // { path: 'map/:id', component: MapComponent },
  { path: 'game/:id', component: GameViewComponent },
  { path: 'game/:id/edit', component: GameEditComponent },
  { path: 'games', component: GameIndexComponent },
  { path: 'new-game', component: GameEditComponent },
  { path: 'character/:id', component: EditCharacterComponent },
  { path: 'game/:gameid/characters', component: CharacterIndexComponent },
  { path: 'game/:gameid/character/:id', component: EditCharacterComponent },
  { path: 'characters', component: CharacterIndexComponent },
  { path: 'monster/:id', component: MonsterComponent },
  { path: 'monsters', component: MonsterIndexPageComponent },
  { path: 'new-character', component: EditCharacterComponent },
  { path: 'map/:id', component: MapComponent },
  { path: 'game/:gameid/maps', component: MapIndexComponent },
  { path: 'game/:gameid/map/:id', component: MapComponent },
  { path: 'game/:gameid/map/:id/edit', component: EditMapComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: PageNotFoundComponent }
];

export class CustomReuseStrategy implements RouteReuseStrategy {
  routesToCache: string[] = ["map"];
  storedRouteHandles = new Map<string, DetachedRouteHandle>();

  // Decides if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log("shouldDetach");

    return this.routesToCache.indexOf(route.routeConfig.path) > -1;
  }

  //Store the information for the route we're destructing
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.log("store");

    this.storedRouteHandles.set(route.routeConfig.path, handle);
  }

  //Return true if we have a stored route object for the next route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log("shouldAttach");

    return this.storedRouteHandles.has(route.routeConfig.path);
  }

  //If we returned true in shouldAttach(), now return the actual route data for restoration
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    console.log("retrieve");

    return this.storedRouteHandles.get(route.routeConfig.path);
  }

  //Reuse the route if we're going to and from the same route
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    console.log("shouldReuseRoute");

    return future.routeConfig === curr.routeConfig;
  }
}



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }]
})
export class AppRoutingModule { }

