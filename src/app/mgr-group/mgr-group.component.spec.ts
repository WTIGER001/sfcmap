import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgrGroupComponent } from './mgr-group.component';

describe('MgrGroupComponent', () => {
  let component: MgrGroupComponent;
  let fixture: ComponentFixture<MgrGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgrGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgrGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
