import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcCardComponent } from './npc-card.component';

describe('NpcCardComponent', () => {
  let component: NpcCardComponent;
  let fixture: ComponentFixture<NpcCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpcCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
