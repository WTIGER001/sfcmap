import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { GameSystem } from '../../../models';

@Component({
  selector: 'app-gamesystem-view',
  templateUrl: './gamesystem-view.component.html',
  styleUrls: ['./gamesystem-view.component.css']
})
export class GamesystemViewComponent implements OnInit {
  @Input() gs: GameSystem

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let gsid = params.get('gsid')
      if (gsid) {
        this.data.gamesystems.subscribe(all => {
          let found = all.find(item => item.id == gsid)
          if (found) {
            this.gs = found
          }
        })
      }
    })
  }

}
