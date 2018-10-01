import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Token } from 'src/app/maps/token';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites = []
  constructor(private dragulaService: DragulaService) {
    dragulaService.createGroup('FAVORITES', {
      copy: (el, source) => {
        return source.id === 'source';
      },
      copyItem: (t: Token) => {
        const newT = new Token()
        Object.assign(newT, t)
        return newT
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== 'destination';
      }
    });
  }


  ngOnInit() {
  }

}
