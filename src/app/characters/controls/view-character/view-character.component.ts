import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Character, Roll } from '../../../models/character';
import { MessageService } from '../../../message.service';
import { DiceCanvasComponent } from '../../../controls/dice-canvas/dice-canvas.component';
import { NotifyService } from '../../../notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { RouteUtil } from '../../../util/route-util';
import { CommonDialogService } from '../../../dialogs/common-dialog.service';
import { DbConfig } from '../../../models/database-config';
import { first, mergeMap } from 'rxjs/operators';
import { Game } from '../../../models';

@Component({
  selector: 'app-view-character',
  templateUrl: './view-character.component.html',
  styleUrls: ['./view-character.component.css']
})
export class ViewCharacterComponent implements OnInit {
  gameid : string
  id : string
  game: Game
  @Input() character: Character
  @ViewChild('dice') dice: DiceCanvasComponent

  constructor(private msg: MessageService, private notify: NotifyService, private route: ActivatedRoute, private data: DataService, private router: Router, private cd: CommonDialogService) { }


  ngOnInit() {

    this.data.game.subscribe( g => this.game = g)

    this.route.paramMap.subscribe(params => {
      console.log("Getting Character from route");
      
      this.id = params.get('id')
      this.gameid = params.get('gameid')

      if (this.gameid) {
        this.data.setCurrentGame(this.gameid)
      }
    })

    this.data.gameAssets.characters.items$
    .subscribe(all => {
      let chr = all.find(c => c.id == this.id)
      if (chr) {
        const filtered = <Character>this.data.filterRestrictedContent(chr)
        console.log("SET Character from route", chr, filtered);
        this.character = filtered
      } 
    })

  }
  roll(r: Roll) {
    const expression = this.evaluate(r)
    console.log("Requesting Roll: ", expression);

    // this.msg.requestRoll(r.name + " " + expression)
    this.dice.rollDice(expression)
  }

  evaluate(r: Roll): string {
    return this.character.resolveExpression(r.expression)
  }

  diceRolled(result) {
    this.notify.success(this.character.name + " rolled a " + result.getTotal() + " on a " + result.expression)
  }

  backUrl(): string[] {
    return RouteUtil.upOneLevel(this.router)

  }
  delete() {
    this.cd.confirm("Are you sure you want to delete " + this.character.name + "? ", "Confirm Delete").subscribe(
      r => {
        if (r) {
          this.data.delete(this.character)
          RouteUtil.goUpOneLevel(this.router)
        }
      }
    )
  }
}
