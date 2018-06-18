import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerSideComponent } from './marker-side.component';

describe('MarkerSideComponent', () => {
  let component: MarkerSideComponent;
  let fixture: ComponentFixture<MarkerSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
