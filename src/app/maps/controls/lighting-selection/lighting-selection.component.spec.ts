import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightingSelectionComponent } from './lighting-selection.component';

describe('LightingSelectionComponent', () => {
  let component: LightingSelectionComponent;
  let fixture: ComponentFixture<LightingSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightingSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
