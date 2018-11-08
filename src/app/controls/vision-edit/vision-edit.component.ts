import { Component, OnInit } from '@angular/core';
import { Vision } from 'src/app/models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { DistanceUnit } from 'src/app/util/transformation';

@Component({
  selector: 'app-vision-edit',
  templateUrl: './vision-edit.component.html',
  styleUrls: ['./vision-edit.component.css']
})
export class VisionEditComponent implements OnInit {
  units = DistanceUnit.units
  vision: Vision
  result = new ReplaySubject<Vision>(1)
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  static open(modal: NgbModal, vision: Vision): any {
    const inst = modal.open(VisionEditComponent)
    inst.componentInstance.vision = vision
    return inst.componentInstance.result
  }

  ok() {
    this.activeModal.dismiss()
    this.result.next(this.vision)
    this.result.complete()
  }

  cancel() {
    this.activeModal.dismiss()
    this.result.complete()
  }

}
