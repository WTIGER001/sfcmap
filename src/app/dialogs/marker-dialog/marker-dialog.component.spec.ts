import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerDialogComponent } from './marker-dialog.component';

describe('MarkerDialogComponent', () => {
  let component: MarkerDialogComponent;
  let fixture: ComponentFixture<MarkerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
