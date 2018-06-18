import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectorComponent } from './map-selector.component';

describe('MapSelectorComponent', () => {
  let component: MapSelectorComponent;
  let fixture: ComponentFixture<MapSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
