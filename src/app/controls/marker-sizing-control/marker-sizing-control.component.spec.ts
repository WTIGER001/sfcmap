import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerSizingControlComponent } from './marker-sizing-control.component';

describe('MarkerSizingControlComponent', () => {
  let component: MarkerSizingControlComponent;
  let fixture: ComponentFixture<MarkerSizingControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerSizingControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerSizingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
