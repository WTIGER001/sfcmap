import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

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
import { CommonDialogService } from './dialogs/common-dialog.service';
import { InputDialogComponent } from './dialogs/input-dialog/input-dialog.component';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MarkerDialogComponent } from './dialogs/marker-dialog/marker-dialog.component';
import { NotifyService } from './notify.service';
import { DataService } from './data.service';
import { MgrGroupComponent } from './mgr-group/mgr-group.component';
import { MgrMarkerComponent } from './mgr-marker/mgr-marker.component';
import { MgrMapComponent } from './mgr-map/mgr-map.component';
import { DialogService } from './dialogs/dialog.service';
import { ChecklistModule } from 'angular-checklist';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapSelectorComponent,
    AdminComponent,
    UserSideComponent,
    MarkerSideComponent,
    TabsComponent,
    InputDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    MarkerDialogComponent,
    MgrGroupComponent,
    MgrMarkerComponent,
    MgrMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFirestoreModule,
    AngularFireStorageModule,
    LeafletModule.forRoot(),
    FontAwesomeModule,
    NgbModule.forRoot(),
    ChecklistModule
  ],
  providers: [
    MarkerService,
    UserService,
    MapService,
    CommonDialogService,
    NotifyService, 
    DataService, 
    DialogService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InputDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent, 
    MgrGroupComponent,
    MgrMapComponent, 
    MgrMarkerComponent
  ]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
