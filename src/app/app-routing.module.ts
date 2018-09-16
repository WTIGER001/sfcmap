import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditCharacterComponent } from './characters/edit-character/edit-character.component';
import { CharacterIndexComponent } from './characters/controls/character-index/character-index.component';
import { GameIndexComponent } from './game/components/game-index/game-index.component';
import { AdminComponent } from './components/admin/admin.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GameEditComponent } from './game/components/game-edit/game-edit.component';
import { GameViewComponent } from './game/components/game-view/game-view.component';
import { EditMapComponent } from './controls/edit-map/edit-map.component';
import { MapIndexComponent } from './maps/controls/map-index/map-index.component';
import { ViewCharacterComponent } from './characters/controls/view-character/view-character.component';
import { EditEncounterComponent } from './encounter/components/edit-encounter/edit-encounter.component';
import { EncounterIndexComponent } from './encounter/components/encounter-index/encounter-index.component';
import { EncounterComponent } from './encounter/components/encounter/encounter.component';
import { GamesystemEditComponent } from './gamesystem/components/gamesystem-edit/gamesystem-edit.component';
import { GamesystemIndexComponent } from './gamesystem/components/gamesystem-index/gamesystem-index.component';
import { GamesystemViewComponent } from './gamesystem/components/gamesystem-view/gamesystem-view.component';
import { DatabaseGuard } from './router/database.guard';
import { MapViewComponent } from './maps/controls/map-view/map-view.component';
import { ItemEditComponent } from './items/components/item-edit/item-edit.component';
import { ItemViewComponent } from './items/components/item-view/item-view.component';
import { ItemIndexComponent } from './items/components/item-index/item-index.component';
import { MonsterIndexComponent } from './monsters/controls/monster-index/monster-index.component';
import { MonsterViewComponent } from './monsters/controls/monster-view/monster-view.component';
import { MonsterEditComponent } from './monsters/controls/monster-edit/monster-edit.component';
import { MapEditComponent } from './maps/controls/map-edit/map-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'home', redirectTo: '/games', pathMatch: 'full' },

  // GAMES
  { path: 'new-game', component: GameEditComponent },
  { path: 'games', component: GameIndexComponent, resolve: { 'asset': DatabaseGuard }},
  { path: 'game/:gameid', component: GameViewComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/edit', component: GameEditComponent, resolve: { 'asset': DatabaseGuard }},

  // CHARACTERS
  { path: 'game/:gameid/new-character', component: EditCharacterComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/characters', component: CharacterIndexComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/characters/:id', component: ViewCharacterComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/characters/:id/edit', component: EditCharacterComponent, resolve: { 'asset': DatabaseGuard } },

  { path: 'game/:gameid/new-map', component: MapEditComponent },
  { path: 'game/:gameid/maps', component: MapIndexComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/maps/:id', component: MapViewComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/maps/:id/edit', component: MapEditComponent, resolve: { 'asset': DatabaseGuard } },

  { path: 'game/:gameid/new-encounter', component: EditEncounterComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/encounters', component: EncounterIndexComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/encounters/:id', component: EncounterComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/encounters/:id/edit', component: EditEncounterComponent, resolve: { 'asset': DatabaseGuard } },

  { path: 'game/:gameid/new-monster', component: PageNotFoundComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/monsters', component: MonsterIndexComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/monsters/:id', component: MonsterViewComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/monsters/:id/edit', component: MonsterEditComponent, resolve: { 'asset': DatabaseGuard } },

  { path: 'game/:gameid/new-item', component: ItemEditComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/items', component: ItemIndexComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/items/:id', component: ItemViewComponent, resolve: { 'asset': DatabaseGuard } },
  { path: 'game/:gameid/items/:id/edit', component: ItemEditComponent, resolve: { 'asset': DatabaseGuard } },

  // { path: 'new-gamesystem', component: GamesystemEditComponent },
  { path: 'gs', component: GamesystemIndexComponent, resolve: { 'asset': DatabaseGuard }  },
  { path: 'gs/:gsid', component: GamesystemViewComponent, resolve: { 'asset': DatabaseGuard }  },
  { path: 'gs/:gsid/edit', component: GamesystemEditComponent, resolve: { 'asset': DatabaseGuard }  },


  { path: 'gs/:gsid/new-monster', component: PageNotFoundComponent },
  { path: 'gs/:gsid/monsters', component: MonsterIndexComponent },
  { path: 'gs/:gsid/monsters/:id', component: MonsterViewComponent },
  { path: 'gs/:gsid/monsters/:id/edit', component: MonsterEditComponent },

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
  providers: [{ provide: RouteReuseStrategy, useClass: CustomReuseStrategy }, DatabaseGuard]
})
export class AppRoutingModule { }

