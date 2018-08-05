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
import { fas, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faStar, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faGithub, fab } from '@fortawesome/free-brands-svg-icons'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
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
import { TagsComponent } from './controls/tags/tags.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MessageService } from './message.service';
import { MapnamePipe } from './pipes/mapname.pipe';
import { LoadingComponent } from './loading/loading.component';
import { DebugObservablesComponent } from './controls/debug-observables/debug-observables.component';
import { CommandService } from './command.service';
import { EditChrAttributesComponent } from './characters/controls/edit-chr-attributes/edit-chr-attributes.component';
import { EditCharacterComponent } from './characters/edit-character/edit-character.component';
import { ViewChrPersonalComponent } from './characters/controls/view-chr-personal/view-chr-personal.component';
import { ViewChrAttributesComponent } from './characters/controls/view-chr-attributes/view-chr-attributes.component';
import { ViewChrRollsComponent } from './characters/controls/view-chr-rolls/view-chr-rolls.component';
import { ViewChrAttachmentsComponent } from './characters/controls/view-chr-attachments/view-chr-attachments.component';
import { ViewChrDescriptionComponent } from './characters/controls/view-chr-description/view-chr-description.component';
import { ViewChrMapLinksComponent } from './characters/controls/view-chr-map-links/view-chr-map-links.component';
import { EditChrMapLinksComponent } from './characters/controls/edit-chr-map-links/edit-chr-map-links.component';
import { EditChrDescriptionComponent } from './characters/controls/edit-chr-description/edit-chr-description.component';
import { EditChrRollsComponent } from './characters/controls/edit-chr-rolls/edit-chr-rolls.component';
import { EditChrAttachmentsComponent } from './characters/controls/edit-chr-attachments/edit-chr-attachments.component';
import { EditChrPersonalComponent } from './characters/controls/edit-chr-personal/edit-chr-personal.component';
import { FilesizePipe } from './pipes/filesize.pipe';
import { ChrPictureComponent } from './characters/controls/chr-picture/chr-picture.component';
import { CharacterSelectorComponent } from './tabs/character-selector/character-selector.component';
import { EditCharacterTypeComponent } from './characters/controls/edit-character-type/edit-character-type.component';
import { CharacterTypeComboComponent } from './characters/controls/character-type-combo/character-type-combo.component';

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
    PageNotFoundComponent,
    MapnamePipe,
    LoadingComponent,
    DebugObservablesComponent,
    EditChrAttributesComponent,
    EditCharacterComponent,
    ViewChrPersonalComponent,
    ViewChrAttributesComponent,
    ViewChrRollsComponent,
    ViewChrAttachmentsComponent,
    ViewChrDescriptionComponent,
    ViewChrMapLinksComponent,
    EditChrMapLinksComponent,
    EditChrDescriptionComponent,
    EditChrRollsComponent,
    EditChrAttachmentsComponent,
    EditChrPersonalComponent,
    FilesizePipe,
    ChrPictureComponent,
    CharacterSelectorComponent,
    EditCharacterTypeComponent,
    CharacterTypeComboComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
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
    CommandService,
    MessageService
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
    library.add(faStar, faCircle)
    library.add(fas, faLayerGroup);
  }
}
