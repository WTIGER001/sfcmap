import { Component, OnInit } from '@angular/core';
import { Token, TokenPack, TokenType } from '../../token';
import { DataService } from 'src/app/data.service';
import { CachedItem } from 'src/app/cache/cache';
import { Assets } from 'src/app/assets';

@Component({
  selector: 'app-token-pack-edit',
  templateUrl: './token-pack-edit.component.html',
  styleUrls: ['./token-pack-edit.component.css']
})
export class TokenPackEditComponent implements OnInit {
  pack: TokenPack
  types: string[]
  page: number = 1

  constructor(private data: DataService) {
    this.pack = new TokenPack()
    this.types = [TokenType.People, TokenType.Objects, TokenType.Animals, TokenType.Backgrounds]
  }

  ngOnInit() {
  }

  getTokens(type: string): Token[] {
    return this.pack.tokens.filter(t => t.type === type)
  }

  trackByFn(index: number, item: Token) {
    return item.id
  }

  addToken(type: string) {

  }

  addTokenFile(file: File, type: string) {
    console.log("Adding Token ", file.name)
    let name = file.name.replace(/_/gi, " ")
    const indx = name.lastIndexOf(".")
    if (indx >= 0) {
      name = name.substr(0, indx)
    }

    const t = new Token()
    t.id = this.pack.id + file.name
    t.fname = file.name
    t.name = name
    t.image = Assets.MissingPicture
    t.owner = this.pack.id

    this.pack.tokens.push(t)

    // Save the Token
    this.data.saveTokenImage(t, file)
  }

  dragging: any = {}
  maxSize = 10000000
  dragOver(e, type) {
    e.preventDefault();
  }

  dragEnter(e, type) {
    e.preventDefault();
    this.dragging[type] = true
  }

  dragLeave(e, type) {
    e.preventDefault();
    this.dragging[type] = false
  }

  drop(e, type) {
    console.log("Dropped ", event, " on ", type, e.dataTransfer.files.length)

    e.stopPropagation();
    e.preventDefault();
    this.dragging[type] = false

    const files = e.dataTransfer.files;
    if (files.length >= 1) {
      this.setFiles(files, type)
    }
    return false;
  }

  setFiles(files: FileList, type: string) {
    const filesToSend = []
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      if (f.size < this.maxSize) {
        filesToSend.push(f)
      }
    }
    filesToSend.forEach(file => {
      this.addTokenFile(file, type)
    })
  }


  // Save is a bit complex. We have to first make sure that all the images are saved to firestore and then we have to create the token.json file. We should then publish the changes
  async save() {

    // Create the JSON file for the token pack
    const json = JSON.stringify(this.pack)

    // Save the JSON file to fire storage
    const path = `/cache/tokenpacks/${this.pack.id}`
    console.log("Saving to Cache", path, json)
    this.data.saveAsFile(path + ".json", json)

    // Add / update an entry in the cache system
    const cachedItem = new CachedItem()
    cachedItem.path = path
    cachedItem.name = this.pack.name;
    cachedItem.version = 1

    try {
      console.log("Making to Cache", path + '.json')
      cachedItem.url = await this.data.storageUrl(path + '.json').toPromise()
    } catch (error) {
      console.error("Error Looking up path", path)
    }
    
    console.log("Saving to Cache", cachedItem)
    this.data.save$(cachedItem, cachedItem.path).subscribe()

    // Add the item to the user list of items
    this.data.userInventory.getValue().tokenSets.push(this.pack.id)
    this.data.save(this.data.userInventory.getValue())
  }

  cancel() {

  }

  nextPage() {
    // validate

    this.page = 2
  }

}
