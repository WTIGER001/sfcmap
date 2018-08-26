import { Component, OnInit, Input, ViewChild, AfterContentInit } from '@angular/core';
import { Game, User } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogService } from '../../../dialogs/common-dialog.service';
import { Observable, of, Subject } from 'rxjs';
import { TagModel } from 'ngx-chips/core/accessor';
import { filter } from 'rxjs/operators';
import { TagInputComponent } from 'ngx-chips';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit, AfterContentInit {

  @ViewChild('gmcontrol') gmcontrol: any
  @ViewChild('playercontrol') playercontrol: any

  game: Game
  userItems: User[] = []
  players : User[] = []
  gms : User[ ]= []
  user: User
  that = this

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router, private cd: CommonDialogService) {
    this.game = new Game()
    this.game.name = "New Game"
    this.players = [this.data.user.getValue()]
    this.gms = [this.data.user.getValue()]
    this.game.system = 'pathfinder'
  }

  ngOnInit() {
    this.data.game.subscribe( g => this.game = g)

    this.data.users.subscribe(users => {
      this.userItems = users
      this.process()
    })
    this.data.user.subscribe(u => {
      this.user = u
      console.log("SET Current User", this.user);
    })
    this.route.paramMap.subscribe(params => {
      let id = params.get('gameid')
      if (id) {
        this.data.games.subscribe(all => {
          let item = all.find(c => c.id == id)
          if (item) {
            this.data.game.next(item)
          }
        })
      }
    })
  }

  process() {
    console.log("PROCESSING");
    
    this.game.players.forEach( id => {
      const user = this.userItems.find( u => u.id == id)
      if (user) {
        console.log("ADDING PLAYER", user);
        this.players.push(user)
      }
    })
    this.game.gms.forEach( id => {

      const user = this.userItems.find( u => u.id == id)
      if (user) {
        console.log("ADDING GM", user);
        this.gms.push(user)
      }
    })
  }

  ngAfterContentInit(): void {
    this.gmcontrol['that'] = this
    this.playercontrol['that'] = this
  }

  onRemoveGm($event) {
    console.log("GM has been removed", $event);
  }

  onRemovingPlayer(tag): Observable<any> {
    console.log("ON REMOVING PLAYER", tag);

    if (this.that.gms.includes(tag)) {
      return this.that.onRemovingGm(tag)
    } else {
      return of(tag)
    }
  }

  onRemovingGm(tag): Observable<any> {
    console.log("ON REMOVING", tag);

    const rtn = new Subject<User>()
    if (this.that.user.id == tag.id) {
      this.that.cd.confirm("Are you sure you want to remove yourself from the GMs list? If you do then when you save you will no longer be able to edit this game").subscribe(r => {
        if (r) {
          rtn.next(tag)
        }
      })
      return rtn
    } else if (this.that.gms.length == 1) {
      this.that.cd.confirm("Are you sure you want to remove the last GM? If so then no one will be able to edit the game or use GM functions").subscribe(r => {
        if (r) {
          rtn.next(tag)
        }
      })
      return rtn
    } else {
      return of(tag)
    }
  }

  onRemovePlayer($event) {
    console.log("Player has been removed", $event);
    const u: User = $event
    if (this.gms.includes(u)) {
      this.gms.splice(this.gms.indexOf(u))
      this.onRemoveGm(u)
    }
  }

  onAddPlayer($event) {
    console.log("Player has been added", $event);
  }

  onAddGm($event) {
    console.log("GM  has been added", $event);
    const u: User = $event
    if (!this.players.includes(u)) {
      this.players.push(u)
    }
  }

  cancel() {

  }

  save() {
    console.log("GMS", this.gms);
    console.log("PLAYERS", this.players);
    this.game.players = this.players.map( p => p.id)
    this.game.gms = this.gms.map( p => p.id)
    this.data.save(this.game)
    this.router.navigate(['/game', this.game.id])
  }

  delete() {

  }

  setPicture($event) {
    this.game.image = $event.url
  }
}
