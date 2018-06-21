import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgrMarkerComponent } from './mgr-marker.component';

describe('MgrMarkerComponent', () => {
  let component: MgrMarkerComponent;
  let fixture: ComponentFixture<MgrMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgrMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgrMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
