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
import { TreeModule } from 'angular-tree-component';
import { ToastrModule } from 'ngx-toastr';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ColorPickerModule } from 'ngx-color-picker';
import { EmojifyModule } from 'angular-emojify';
import { TagInputModule } from 'ngx-chips';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faGithub, fab } from '@fortawesome/free-brands-svg-icons'

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { MapSelectorComponent } from './tabs/map-selector/map-selector.component';
import { AdminComponent } from './tabs/admin/admin.component';
import { UserSideComponent } from './tabs/user-side/user-side.component';
import { MarkerTabComponent } from './tabs/marker-tab/marker-tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { MapService } from './map.service';
import { CommonDialogService } from './dialogs/common-dialog.service';
import { InputDialogComponent } from './dialogs/input-dialog/input-dialog.component';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { NotifyService } from './notify.service';
import { DataService } from './data.service';
import { DialogService } from './dialogs/dialog.service';
import { ChecklistModule } from 'angular-checklist';
import { AccessDialogComponent } from './dialogs/access-dialog/access-dialog.component';
import { RestrictService } from './dialogs/restrict.service';
import { MarkerComboComponent } from './controls/marker-combo/marker-combo.component';
import { LayersTabComponent } from './tabs/layers-tab/layers-tab.component';
import { MarkerGroupComboComponent } from './controls/marker-group-combo/marker-group-combo.component';
import { UnchecklistDirective } from './controls/unchecklist.directive';
import { MarkerSizingControlComponent } from './controls/marker-sizing-control/marker-sizing-control.component';
import { LoginComponent } from './login/login.component';
import { DistanceEntryComponent } from './dialogs/distance-entry/distance-entry.component';
import { MapTabComponent } from './tabs/map-tab/map-tab.component';
import { ReadmoreComponent } from './controls/readmore/readmore.component';
import { EditMapComponent } from './controls/edit-map/edit-map.component';
import { MapTypeComboComponent } from './controls/map-type-combo/map-type-combo.component';
import { LineWeightComponent } from './controls/line-weight/line-weight.component';
import { LineStyleComponent } from './controls/line-style/line-style.component';
import { EditShapeComponent } from './controls/edit-shape/edit-shape.component';
import { EditLineComponent } from './controls/edit-line/edit-line.component';
import { EditMarkerComponent } from './controls/edit-marker/edit-marker.component';
import { ViewboxDirective } from './controls/viewbox.directive';
import { SvgboxComponent } from './controls/svgbox/svgbox.component';
import { TextboxStyleComboComponent } from './controls/textbox-style-combo/textbox-style-combo.component';
import { CheckboxComponent } from './controls/checkbox/checkbox.component';
import { EditMarkerTypeComponent } from './controls/edit-marker-type/edit-marker-type.component';
import { EditMarkerTypeCategoryComponent } from './controls/edit-marker-type-category/edit-marker-type-category.component';
import { MarkerTypeManagerComponent } from './controls/marker-type-manager/marker-type-manager.component';
import { GroupManagerComponent } from './controls/group-manager/group-manager.component';
import { EditMapTypeComponent } from './controls/edit-map-type/edit-map-type.component';
import { EditImageComponent } from './controls/edit-image/edit-image.component';
import { FilePickerComponent } from './controls/file-picker/file-picker.component';
import { RpgTabComponent } from './tabs/rpg-tab/rpg-tab.component';
import { AudioService } from './audio.service';
import { HotKeyService } from './hot-key.service';
import { TagsComponent } from './controls/tags/tags.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapSelectorComponent,
    AdminComponent,
    UserSideComponent,
    MarkerTabComponent,
    TabsComponent,
    InputDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    AccessDialogComponent,
    MarkerComboComponent,
    LayersTabComponent,
    MarkerGroupComboComponent,
    UnchecklistDirective,
    MarkerSizingControlComponent,
    LoginComponent,
    DistanceEntryComponent,
    MapTabComponent,
    ReadmoreComponent,
    EditMapComponent,
    MapTypeComboComponent,
    LineWeightComponent,
    LineStyleComponent,
    EditShapeComponent,
    EditLineComponent,
    EditMarkerComponent,
    ViewboxDirective,
    SvgboxComponent,
    TextboxStyleComboComponent,
    CheckboxComponent,
    EditMarkerTypeComponent,
    EditMarkerTypeCategoryComponent,
    MarkerTypeManagerComponent,
    GroupManagerComponent,
    EditMapTypeComponent,
    EditImageComponent,
    FilePickerComponent,
    RpgTabComponent,
    TagsComponent,
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
    TreeModule,
    ChecklistModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    }),
    DragAndDropModule.forRoot(),
    ColorPickerModule,
    TagInputModule,
    EmojifyModule
  ],
  providers: [
    MapService,
    CommonDialogService,
    NotifyService,
    DataService,
    DialogService,
    RestrictService,
    AudioService,
    HotKeyService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InputDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    AccessDialogComponent,
    DistanceEntryComponent
  ],
  exports: [CheckboxComponent]
})
export class AppModule {
  constructor() {
    library.add(faGoogle, faGithub)
    library.add(faStar)
    library.add(fas);
  }
}
