import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageToolbarComponent } from './page-toolbar.component';

describe('PageToolbarComponent', () => {
  let component: PageToolbarComponent;
  let fixture: ComponentFixture<PageToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
