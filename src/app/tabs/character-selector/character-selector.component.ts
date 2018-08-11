import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { MapType, MapConfig, MergedMapType, User, Prefs } from '../../models';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';
import { EditMapComponent } from '../../controls/edit-map/edit-map.component';
import { EditMapTypeComponent } from '../../controls/edit-map-type/edit-map-type.component';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { Router } from '@angular/router';
import { CharacterType } from '../../models/character-type';
import { Character, Attachment } from '../../models/character';
import { EditCharacterComponent } from '../../characters/edit-character/edit-character.component';
import { HeroLabCharacter } from '../../characters/hero-lab';
import { LangUtil } from '../../util/LangUtil';
import { mergeMap, map } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.css']
})
export class CharacterSelectorComponent implements OnInit {
  @ViewChild('editcharacter') editcharacter: EditCharacterComponent
  @ViewChild('editfolder') editfolder: EditMapTypeComponent
  @ViewChild('filecontrol') fileButton

  characters: Array<CharacterType> = []
  filtered: Array<CharacterType> = []
  recent: Array<Character> = []

  edit = false
  folder: CharacterType
  newMapCfg: Character
  isCollapsed = {}
  filter = ''
  tool

  constructor(private data: DataService, private mapSvc: MapService, private cd: CommonDialogService, private router: Router) {
    this.data.characterTypes.subscribe(items => {
      this.characters = items
      this.updateList()
    })

  }

  ngOnInit() {
  }

  newFolder() {
    let f = new CharacterType()
    f.id = 'TEMP'
    f.name = "New Folder"
    this.edit = true
    this.folder = f
  }

  editStart() {
    this.edit = true
  }

  delete() {
    if (this.folder) {
      this.cd.confirm("Are you sure you want to delete " + this.folder.name + "? If you do then you will not be able to access the characters in this category any longer.", "Confirm Delete").subscribe(
        r => {
          if (r) {
            let f = new CharacterType()
            f.id = this.folder.id
            this.data.delete(f)
            this.folder = undefined
          }
        }
      )
    }
  }

  setFile(event) {
    if (event.target.files[0]) {
      LangUtil.readFile(event.target.files[0]).pipe(
        mergeMap(txt => HeroLabCharacter.importData(txt))
      ).subscribe(chrs => {
        chrs.forEach(chr => {
          chr.id = UUID.UUID().toString()
          console.log("CHARACTER : ", chr);
          this.saveFile(event.target.files[0], chr)
        })
      })
    }
  }

  saveFile(f: File, character: Character) {
    let path = 'attachments/' + character.id + "/" + f.name
    this.data.uploadFile(path, f).subscribe(
      progress => { },
      error => { },
      () => {
        this.data.pathToUrl(path)
          .pipe(map(url => {
            const att = new Attachment()
            att.name = f.name
            att.size = f.size
            att.url = url
            character.attachments.push(att)
          })).subscribe(() => {
            this.data.save(character)
          })
      }
    )
  }

  importCharacter() {
    this.fileButton.nativeElement.click()
  }

  newCharacter() {
    this.router.navigate(['/new-character'])
    this.edit = true
  }
  selectFolder(cType: CharacterType) {
    this.folder = cType
  }

  select(item: Character) {
    this.router.navigate(['/character/' + item.id])
    // this.data.saveRecentCharacter(item.id)
  }

  filterUpdate(event) {
    this.filter = event
    this.updateList()
  }

  save() {
    if (this.newMapCfg) {
      this.editcharacter.save()
    } else if (this.folder) {
      this.editfolder.save()
    }

    this.cancel()
  }

  cancel() {
    this.edit = false
    this.newMapCfg = undefined
    this.folder = undefined
  }

  clearFilter() {
    if (this.filter.length > 0) {
      this.filter = ''
      this.updateList()
    }
  }

  updateList() {
    if (this.filter && this.filter.length > 0) {
      let searchFor = this.filter.toLowerCase()

      let items = new Array<CharacterType>()

      this.characters.forEach(cat => {
        let single = new CharacterType()
        single._characters = []
        single.name = cat.name
        single.id = cat.id

        cat._characters.forEach(item => {
          if (item.name.toLowerCase().includes(searchFor)) {
            single._characters.push(item)
          }
        })

        if (single._characters.length > 0) {
          items.push(single)
        }
      })
      this.filtered = items
    } else {
      this.filtered = this.characters
    }
  }
}
