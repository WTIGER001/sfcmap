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
import { SortablejsModule } from 'angular-sortablejs/dist';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { faStar, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faGithub, fab } from '@fortawesome/free-brands-svg-icons';
import { NgSpinKitModule } from 'ng-spin-kit';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { environment } from '../environments/environment';
import { MapComponent } from './map/map.component';
import { MapSelectorComponent } from './tabs/map-selector/map-selector.component';
// import { AdminComponent } from './tabs/admin/admin.component';
import { AdminComponent } from './components/admin/admin.component';
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
import { DebugObservablesComponent } from './controls/debug-observables/debug-observables.component';
import { CommandService } from './command.service';
import { EditChrAttributesComponent } from './characters/controls/edit-chr-attributes/edit-chr-attributes.component';
import { EditCharacterComponent } from './characters/edit-character/edit-character.component';
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
import { ViewCharacterComponent } from './characters/controls/view-character/view-character.component';
import { EncountersTabComponent } from './tabs/encounters-tab/encounters-tab.component';
import { EncounterComponent } from './encounter/components/encounter/encounter.component';
import { EncounterCardComponent } from './encounter/components/encounter-card/encounter-card.component';
import { EditEncounterComponent } from './encounter/components/edit-encounter/edit-encounter.component';
import { EncounterFeature } from './encounter/encounter.feature';
import { FilterinputComponent } from './controls/filterinput/filterinput.component';
import { AttrValueComponent } from './characters/controls/attr-value/attr-value.component';
import { MapSelectComponent } from './controls/map-select/map-select.component';
import { FindCharacterComponent } from './characters/controls/find-character/find-character.component';
import { ImportCharacterComponent } from './characters/dialogs/import-character/import-character.component';
import { FileDropComponent } from './controls/file-drop/file-drop.component';
import { UserOnlineComponent } from './controls/user-online/user-online.component';
import { MonsterComponent } from './monsters/controls/monster/monster.component';
import { KeepStylePipe } from './pipes/keep-style.pipe';
import { MonsterIndexPageComponent } from './monsters/controls/monster-index-page/monster-index-page.component';
import { RandomImageComponent } from './dialogs/random-image/random-image.component';
import { EditMonsterComponent } from './monsters/controls/edit-monster/edit-monster.component';
import { EditPictureComponent } from './controls/edit-picture/edit-picture.component';
import { CharacterIndexComponent } from './characters/controls/character-index/character-index.component';
import { CharacterCardComponent } from './characters/controls/character-card/character-card.component';
import { DiceCanvasComponent } from './controls/dice-canvas/dice-canvas.component';
import { GameMenuComponent } from './controls/game-menu/game-menu.component';
import { MapIndexComponent } from './maps/controls/map-index/map-index.component';
import { NpcIndexComponent } from './npcs/components/npc-index/npc-index.component';
import { NpcCardComponent } from './npcs/components/npc-card/npc-card.component';
import { SpellIndexComponent } from './spells/components/spell-index/spell-index.component';
import { SpellCardComponent } from './spells/components/spell-card/spell-card.component';
import { ItemIndexComponent } from './items/components/item-index/item-index.component';
import { ItemCardComponent } from './items/components/item-card/item-card.component';
import { GameIndexComponent } from './game/components/game-index/game-index.component';
import { GameCardComponent } from './game/components/game-card/game-card.component';
import { GameEditComponent } from './game/components/game-edit/game-edit.component';
import { GamesystemEditComponent } from './gamesystem/components/gamesystem-edit/gamesystem-edit.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GameViewComponent } from './game/components/game-view/game-view.component';
import { PageToolbarComponent } from './controls/page-toolbar/page-toolbar.component';
import { SearchBarComponent } from './controls/search-bar/search-bar.component';
import { SortDialogComponent } from './dialogs/sort-dialog/sort-dialog.component';
import { FilterDialogComponent } from './dialogs/filter-dialog/filter-dialog.component';
import { MapCardComponent } from './maps/controls/map-card/map-card.component';
import { EncounterIndexComponent } from './encounter/components/encounter-index/encounter-index.component';
import { RestrictToolComponent } from './controls/restrict-tool/restrict-tool.component';
import { CharacterService } from './characters/dialogs/character.service';
import { GamesystemCardComponent } from './gamesystem/components/gamesystem-card/gamesystem-card.component';
import { GamesystemIndexComponent } from './gamesystem/components/gamesystem-index/gamesystem-index.component';
import { GamesystemViewComponent } from './gamesystem/components/gamesystem-view/gamesystem-view.component';
import { CancelViewToolComponent } from './controls/cancel-view-tool/cancel-view-tool.component';
import { DeleteToolComponent } from './controls/delete-tool/delete-tool.component';
import { EditToolComponent } from './controls/edit-tool/edit-tool.component';
import { RestrictionToggleComponent } from './controls/restriction-toggle/restriction-toggle.component';
import { LinksComponent } from './dialogs/links/links.component';

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
    DebugObservablesComponent,
    EditChrAttributesComponent,
    EditCharacterComponent,
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
    ViewCharacterComponent,
    EncountersTabComponent,
    EncounterComponent,
    EncounterCardComponent,
    EditEncounterComponent,
    FilterinputComponent,
    AttrValueComponent,
    MapSelectComponent,
    FindCharacterComponent,
    ImportCharacterComponent,
    FileDropComponent,
    UserOnlineComponent,
    MonsterComponent,
    KeepStylePipe,
    MonsterIndexPageComponent,
    RandomImageComponent,
    EditMonsterComponent,
    EditPictureComponent,
    CharacterIndexComponent,
    CharacterCardComponent,
    DiceCanvasComponent,
    GameMenuComponent,
    MapIndexComponent,
    NpcIndexComponent,
    NpcCardComponent,
    SpellIndexComponent,
    SpellCardComponent,
    ItemIndexComponent,
    ItemCardComponent,
    GameIndexComponent,
    GameCardComponent,
    GameEditComponent,
    GamesystemEditComponent,
    SettingsComponent,
    GameViewComponent,
    PageToolbarComponent,
    SearchBarComponent,
    SortDialogComponent,
    FilterDialogComponent,
    MapCardComponent,
    EncounterIndexComponent,
    RestrictToolComponent,
    GamesystemCardComponent,
    GamesystemIndexComponent,
    GamesystemViewComponent,
    CancelViewToolComponent,
    DeleteToolComponent,
    EditToolComponent,
    RestrictionToggleComponent,
    LinksComponent,
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
    AngularFirestoreModule.enablePersistence(),
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
    EmojifyModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgSpinKitModule,
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
    MessageService,
    CharacterService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    InputDialogComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    AccessDialogComponent,
    DistanceEntryComponent,
    RandomImageComponent,
    SortDialogComponent,
    FilterDialogComponent,
    ImportCharacterComponent,
    LinksComponent,
  ],
  exports: [CheckboxComponent]
})
export class AppModule {
  constructor() {
    library.add(faGoogle, faGithub)
    library.add(faStar, faCircle)
    library.add(fas, faLayerGroup);

    EncounterFeature.initialize()
  }
}
