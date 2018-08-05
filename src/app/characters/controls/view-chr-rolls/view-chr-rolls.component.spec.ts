import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChrRollsComponent } from './view-chr-rolls.component';

describe('ViewChrRollsComponent', () => {
  let component: ViewChrRollsComponent;
  let fixture: ComponentFixture<ViewChrRollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChrRollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChrRollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
