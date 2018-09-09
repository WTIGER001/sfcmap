import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Game, Asset } from '../../../models';
import { Item } from '../../item';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  item : Item
  game: Game
  constructor(private data: DataService, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.data.game.subscribe(g => this.game = g)
    this.route.data.subscribe((data: { asset: Asset }) => this.item = <Item>data.asset)
  }

  keywords() : string {
    const words = []

    this.item.majorArtifactFlag?words.push("Major Artifact"):""
    this.item.minorArtifactFlag ? words.push("Minor Artifact") : ""
    this.item.mythic ? words.push("Mythic") : ""
    this.item.universal ? words.push("Universal") : ""
    this.item.legendaryWeapon ? words.push("Legendary") : ""

    return words.join(", ")
  }

  schools() : string {
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
