import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitterEditComponent } from './emitter-edit.component';

describe('EmitterEditComponent', () => {
  let component: EmitterEditComponent;
  let fixture: ComponentFixture<EmitterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
