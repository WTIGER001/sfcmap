import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceEntryComponent } from './distance-entry.component';

describe('DistanceEntryComponent', () => {
  let component: DistanceEntryComponent;
  let fixture: ComponentFixture<DistanceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
