import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../data.service';
import { MapConfig } from '../models';

@Pipe({
  name: 'mapname'
})
export class MapnamePipe implements PipeTransform {
  maps: MapConfig[]
  constructor(private data: DataService) {
    this.data.maps.subscribe(m => this.maps = m)
  }

  transform(value: any, args?: any): any {
    let found = this.maps.find(m => m.id == value)
    if (found) {
      return found.name
    }
    return value;
  }

}
