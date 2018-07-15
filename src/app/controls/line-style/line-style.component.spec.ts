import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineStyleComponent } from './line-style.component';

describe('LineStyleComponent', () => {
  let component: LineStyleComponent;
  let fixture: ComponentFixture<LineStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
