import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNameComponent } from './group-name.component';

describe('GroupNameComponent', () => {
  let component: GroupNameComponent;
  let fixture: ComponentFixture<GroupNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
