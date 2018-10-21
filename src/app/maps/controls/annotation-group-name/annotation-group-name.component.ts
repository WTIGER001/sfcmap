import { Component, OnInit, Input } from '@angular/core';
import { MarkerGroup, Annotation } from 'src/app/models';
import { MapService } from '../../map.service';
import { DataService } from 'src/app/data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-annotation-group-name',
  templateUrl: './annotation-group-name.component.html',
  styleUrls: ['./annotation-group-name.component.css']
})
export class AnnotationGroupNameComponent implements OnInit {
  @Input() item : Annotation
  groups: MarkerGroup[] = []

  constructor(private mapSvc: MapService, private data: DataService) { 
    this.mapSvc.mapConfig.subscribe(m => {
 
      this.data.gameAssets.annotationFolders.items$.pipe(
        map(items => items.filter(i => i.map == m.id))
      ).subscribe(items => this.groups = items)
    })

  }

  ngOnInit() {
  }

  name(): string {
    let mk = this.groups.find(grp => grp.id == this.item.group)
    if (mk) {
      return mk.name
    }
    return 'Ugh....'
  }

}
