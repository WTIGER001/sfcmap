import { Component, OnInit, Input } from '@angular/core';
import { MapType } from '../../models';
import { UUID } from 'angular2-uuid';
import { DataService } from '../../data.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Format } from 'src/app/util/format';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';

@Component({
  selector: 'app-edit-map-type',
  templateUrl: './edit-map-type.component.html',
  styleUrls: ['./edit-map-type.component.css']
})
export class EditMapTypeComponent implements OnInit {
  all : MapType[] = []
  result : Subject<boolean>

  constructor(private data: DataService, private activeModal : NgbActiveModal, private dialog : CommonDialogService) { 
    this.data.gameAssets.mapTypes.items$.subscribe( types => this.all = types.sort( (a, b)=> a.order - b.order ))
  }

  ngOnInit() {
  }

  update(item: MapType) {
    this.data.save(item)
  }

  save(selected : MapType) {
    this.data.save(selected)
  }

  close() {
    this.activeModal.dismiss()
    this.result.next(true)
    this.result.complete()
  }

  delete(item: MapType) {
    this.dialog.confirm(`Are you sure you want to delete ${item.name}? This will affect any maps assigned to this folder.`, "Confirm" ).subscribe( a => {
      if (a) {
        this.data.delete(item);
      }
    })
  }

  addItem() {
    let m = new MapType()
    m.owner = this.data.game.getValue().id
    m.name = Format.nextString("New Folder", this.all.map(a => a.name))
    m.order = 1000
    this.data.save(m)
  }

  public static openDialog(modal : NgbModal) : Observable<boolean> {
    const rtn = new ReplaySubject<boolean>(1)
    const d = modal.open(EditMapTypeComponent);
    d.componentInstance.result = rtn
    return rtn
  }
}
