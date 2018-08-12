import { Injectable } from '@angular/core';
import { RandomImageComponent } from './random-image/random-image.component';
import { ImageSearchResult } from '../util/GoogleImageSearch';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private modalSvc: NgbModal) {

  }

  public openRandomImage(searchTerm?: string): Observable<ImageSearchResult> {

    const modalRef = this.modalSvc.open(RandomImageComponent);
    modalRef.componentInstance.searchTerm = searchTerm
    modalRef.componentInstance.result = new Subject<ImageSearchResult>()
    return modalRef.componentInstance.result
  }
}