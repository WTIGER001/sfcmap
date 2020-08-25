import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { RestrictService } from '../../dialogs/restrict.service';
import { RouteUtil } from '../../util/route-util';
import { Asset } from '../../models';
import { faTreeChristmas } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-edit-character',
  templateUrl: './edit-character.component.html',
  styleUrls: ['./edit-character.component.css']
})
export class EditCharacterComponent implements OnInit {
  character = new Character()

  constructor(private data: DataService, private route: ActivatedRoute, private cd: CommonDialogService, private router: Router) {
    this.character.name = 'New Character'
    // let path = route.snapshot.paramMap.get("gameid")
    this.character.owner = route.snapshot.paramMap.get("gameid")
    this.character.id = UUID.UUID().toString()
  }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      if (data.asset) {
        this.character = <Character>data.asset
      } 
    })
  }

  save() {
    // Get the game
    this.data.save(this.character)
    RouteUtil.goUpOneLevel(this.router)
  }

  cancel() {
    RouteUtil.goUpOneLevel(this.router)
  }

  delete() {
    RouteUtil.goUpTwoLevels(this.router)
  }
}
