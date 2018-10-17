import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterOverlayComponent } from './encounter-overlay.component';

describe('EncounterOverlayComponent', () => {
  let component: EncounterOverlayComponent;
  let fixture: ComponentFixture<EncounterOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
