import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Vision } from 'src/app/models';

@Component({
  selector: 'app-vision-light-edit',
  templateUrl: './vision-light-edit.component.html',
  styleUrls: ['./vision-light-edit.component.css']
})
export class VisionLightEditComponent implements OnInit {

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit() {

  }
 
  public static openDialog(modal : NgbModal, vision : Vision) {
    
  }

}
