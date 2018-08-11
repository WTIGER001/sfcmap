import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HeroLabCharacter } from '../../hero-lab';
import { LangUtil } from '../../../util/LangUtil';
import { mergeMap, map } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { PCGenXml } from '../../pcgen-xml';
import { Character, Attachment } from '../../../models';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-import-character',
  templateUrl: './import-character.component.html',
  styleUrls: ['./import-character.component.css']
})
export class ImportCharacterComponent implements OnInit {
  show = "NONE"
  @Output() done = new EventEmitter()

  constructor(private data: DataService) { }

  ngOnInit() {
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
}
