import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterIndexComponent } from './encounter-index.component';

describe('EncounterIndexComponent', () => {
  let component: EncounterIndexComponent;
  let fixture: ComponentFixture<EncounterIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
