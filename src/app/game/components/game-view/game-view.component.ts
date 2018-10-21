import { Component, OnInit } from '@angular/core';
import { Game, User } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RestrictService } from '../../../dialogs/restrict.service';
import { CommonDialogService } from '../../../dialogs/common-dialog.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  gamesystem = 'UNK'
  game: Game
  user: User
  restricted = false;

  cntCharacters = 0
  cntMaps = 0
  cntEncounters = 0
  cntMonsters = 0
  cntItems = 0
  cntSpells = 0

  constructor(private data: DataService, private route: ActivatedRoute, private restrict: RestrictService, private cd: CommonDialogService, private router: Router, private afAuth: AngularFireAuth) {
    this.data.user.subscribe(u => this.user = u);
  }

  ngOnInit() {

    this.data.gameAssets.characters.items$.subscribe(items => this.cntCharacters = items.length)
    // this.data.gameAssets.monsters.items$.subscribe(items => this.cntMonsters = items.length)
    this.data.pathfinder.monsters$.subscribe(items => this.cntMonsters = items.length)
    
    this.data.gameAssets.maps.items$.subscribe(items => this.cntMaps = items.length)
    this.data.gameAssets.encounters.items$.subscribe(items => this.cntEncounters = items.length)
    this.data.gameAssets.items.items$.subscribe(items => this.cntItems = items.length)

    this.route.paramMap.subscribe(params => {
      let id = params.get('gameid')
      let edit = params.get('edit')
      console.log("MY PARAMS ", id, edit);

      if (id) {

        console.log("Subscribing to  Games");

        this.data.games.subscribe(all => {
          console.log("Exampining Games", all);

          let item = all.find(c => c.id == id)
          if (item) {
            console.log("FOUND GAME", item);
            this.game = item
            this.gamesystem = item.system
            this.restricted = this.data.isRestricted(this.game)
            this.data.game.next(item)
          }
        })
      }
    })
  }

  delete() {
    this.cd.confirm("Are you sure you want to delete " + this.game.name + "? ", "Confirm Delete").subscribe(
      r => {
        if (r) {
          this.data.delete(this.game)
          this.router.navigate(['/games'])
        }
      }
    )
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
