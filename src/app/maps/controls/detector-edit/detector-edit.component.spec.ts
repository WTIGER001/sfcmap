import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectorEditComponent } from './detector-edit.component';

describe('DetectorEditComponent', () => {
  let component: DetectorEditComponent;
  let fixture: ComponentFixture<DetectorEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
