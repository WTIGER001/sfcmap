import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import { Item } from '../../item';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {
  static pages = ['information', 'description']
  @Input() size: string = 'card'
  @Input() item: Item
  @Input() position = 1
  direction = 0
  @Input() page = 'description'

  constructor(private data: DataService) {

  }

  ngOnInit() {
  }

  nextPage($event) {
    let indx = ItemCardComponent.pages.indexOf(this.page)
    indx += 1;
    if (indx >= ItemCardComponent.pages.length) {
      indx = 0;
    }
    this.page = ItemCardComponent.pages[indx]
  }

  prevPage($event) {
    let indx = ItemCardComponent.pages.indexOf(this.page)
    indx -= 1;
    if (indx < 0) {
      indx = ItemCardComponent.pages.length - 1;
    }
    this.page = ItemCardComponent.pages[indx]
  }

  togglePosition() {
    if (this.position == 3 || this.position == 2) {
      this.direction = -1
      this.position = 1
    } else if (this.position == 1) {
      this.direction = 1
      this.position = 2
    }
  }

  togglePositionMax() {
    if (this.position == 3) {
      this.direction = -1
      this.position = 1
    } else if (this.position == 1) {
      this.direction = 1
      this.position = 3
    } else {
      this.position += this.direction
      this.position = this.direction == 1 ? 3 : 1
      this.direction *= -1
    }
  }

  canView(): boolean {
    return this.data.canView(this.item)
  }

  keywords(): string {
    const words = []

    this.item.majorArtifactFlag ? words.push("Major Artifact") : ""
    this.item.minorArtifactFlag ? words.push("Minor Artifact") : ""
    this.item.mythic ? words.push("Mythic") : ""
    this.item.universal ? words.push("Universal") : ""
    this.item.legendaryWeapon ? words.push("Legendary") : ""

    return words.join(", ")
  }

  schools(): string {
    const words = []

    this.item.abjuration ? words.push("Abjuration") : "";
    this.item.conjuration ? words.push("Conjuration") : "";
    this.item.divination ? words.push("Divination") : "";
    this.item.enchantment ? words.push("Enchantment") : "";
    this.item.evocation ? words.push("Evocation") : "";;
    this.item.necromancy ? words.push("Necromancy") : ""
    this.item.transmutation ? words.push("Transmutation") : "";
    this.item.illusion ? words.push("Illusion") : "";

    return words.join(", ")
  }
}