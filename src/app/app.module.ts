import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { MarkerService } from './marker.service';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { MapSelectorComponent } from './map-selector/map-selector.component';
import { AdminComponent } from './admin/admin.component';
import { UserSideComponent } from './user-side/user-side.component';
import { MarkerSideComponent } from './marker-side/marker-side.component';
import { TabsComponent } from './tabs/tabs.component';
import { MapService } from './map.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapSelectorComponent,
    AdminComponent,
    UserSideComponent,
    MarkerSideComponent,
    TabsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFirestoreModule,
    LeafletModule.forRoot(),
    FontAwesomeModule

  ],
  providers: [MarkerService, UserService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
