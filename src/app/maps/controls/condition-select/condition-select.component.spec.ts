import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionSelectComponent } from './condition-select.component';

describe('ConditionSelectComponent', () => {
  let component: ConditionSelectComponent;
  let fixture: ComponentFixture<ConditionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
