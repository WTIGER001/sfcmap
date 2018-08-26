import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../../data.service';
import { LangUtil } from '../../../util/LangUtil';
import { mergeMap, map } from 'rxjs/operators';
import { HeroLabCharacter } from '../../hero-lab';
import { PCGenXml } from '../../pcgen-xml';
import { UUID } from 'angular2-uuid';
import { Character, Attachment, Game, Restricition } from '../../../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-character',
  templateUrl: './import-character.component.html',
  styleUrls: ['./import-character.component.css']
})
export class ImportCharacterComponent implements OnInit {
  show = "NONE"
  game: Game
  @Output() done = new EventEmitter()

  constructor(private data: DataService, private modal: NgbActiveModal) { }

  ngOnInit() {
    this.data.game.subscribe(g => this.game = g)
  }

  cancel() {
    this.modal.dismiss()
  }

  toggle(type: string) {
    if (this.show == type) {
      this.show = ""
    } else {
      this.show = type
    }
  }

  setFile(files: FileList) {
    if (files[0]) {
      LangUtil.readFile(files[0]).pipe(
        mergeMap(txt => {
          if (this.show == 'hero') {
            return HeroLabCharacter.importData(txt)
          } else if (this.show == 'pcgen') {
            return PCGenXml.importData(txt)
          }
        })
      ).subscribe(chrs => {
        chrs.forEach(chr => {
          chr.id = UUID.UUID().toString()
          console.log("CHARACTER : ", chr);
          this.saveFile(files[0], chr)
        })
        this.done.emit(chrs)
      })
    }
  }

  saveFile(f: File, character: Character) {
    character.owner = this.game.id
    character.restriction = Restricition.PlayerReadWrite
    
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
            this.modal.dismiss()
          })
      }
    )
  }
}