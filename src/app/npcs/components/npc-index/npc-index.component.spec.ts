import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcIndexComponent } from './npc-index.component';

describe('NpcIndexComponent', () => {
  let component: NpcIndexComponent;
  let fixture: ComponentFixture<NpcIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpcIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
