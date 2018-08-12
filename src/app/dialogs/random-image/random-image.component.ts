import { Component, OnInit, Input } from '@angular/core';
import { ImageSearchResult, GoogleImageSearch } from '../../util/GoogleImageSearch';
import { ReplaySubject, Subject, BehaviorSubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-random-image',
  templateUrl: './random-image.component.html',
  styleUrls: ['./random-image.component.css']
})
export class RandomImageComponent implements OnInit {
  public result: Subject<ImageSearchResult>;
  public items: ImageSearchResult[] = []
  public loading = false;
  private s = new BehaviorSubject<string>('')
  constructor(private active: NgbActiveModal) { }

  public set searchTerm(v: string) {
    this.s.next(v)
  }

  public get searchTerm(): string {
    return this.s.getValue()
  }

  ngOnInit() {
    this.s.pipe(throttleTime(250)).subscribe(s => {
      this.runSearch(s)
    })
  }

  pick(me: ImageSearchResult) {
    this.result.next(me)
    this.active.close()
  }

  updateSearch(term: string) {
    this.searchTerm = term
  }

  runSearch(term: String) {
    if (term && term.length > 2) {
      this.loading = true
      GoogleImageSearch.searchImage(term).then(results => {
        this.items = results
        this.loading = false
      })
    }
  }


  close() {
    this.active.close()
  }
}
