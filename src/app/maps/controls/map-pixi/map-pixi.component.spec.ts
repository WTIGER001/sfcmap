import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPixiComponent } from './map-pixi.component';

describe('MapPixiComponent', () => {
  let component: MapPixiComponent;
  let fixture: ComponentFixture<MapPixiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPixiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPixiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
