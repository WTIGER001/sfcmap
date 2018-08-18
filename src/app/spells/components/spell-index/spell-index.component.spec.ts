import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellIndexComponent } from './spell-index.component';

describe('SpellIndexComponent', () => {
  let component: SpellIndexComponent;
  let fixture: ComponentFixture<SpellIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
