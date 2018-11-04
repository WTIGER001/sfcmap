import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionLightEditComponent } from './vision-light-edit.component';

describe('VisionLightEditComponent', () => {
  let component: VisionLightEditComponent;
  let fixture: ComponentFixture<VisionLightEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionLightEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionLightEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
