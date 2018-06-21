import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgrMapComponent } from './mgr-map.component';

describe('MgrMapComponent', () => {
  let component: MgrMapComponent;
  let fixture: ComponentFixture<MgrMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgrMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgrMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
