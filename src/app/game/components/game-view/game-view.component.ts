import { Component, OnInit } from '@angular/core';
import { Game, User } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { RestrictService } from '../../../dialogs/restrict.service';
import { CommonDialogService } from '../../../dialogs/common-dialog.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  game: Game
  user: User
  restricted = false;

  constructor(private data: DataService, private route: ActivatedRoute, private restrict: RestrictService, private cd: CommonDialogService) {
    this.data.user.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.games.subscribe(all => {
          let item = all.find(c => c.id == id)
          if (item) {
            this.game = item
            this.restricted = this.data.isRestricted(this.game)
            this.data.game.next(item)
          }
        })
      }
    })
  }

  permissions() {
    if (this.game) {
      this.restrict.openRestrict(this.game.view, this.game.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.game)) {
          this.game.edit = edit
          this.game.view = view
          this.data.save(this.game)
          this.restricted = this.data.isRestricted(this.game)
        }
      })
    }
  }


  delete() {
    this.cd.confirm("Are you sure you want to delete " + this.game.name + "? ", "Confirm Delete").subscribe(
      r => {
        if (r) {
          this.data.delete(this.game)
        }
      }
    )
  }

}
