import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPackViewComponent } from './token-pack-view.component';

describe('TokenPackViewComponent', () => {
  let component: TokenPackViewComponent;
  let fixture: ComponentFixture<TokenPackViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenPackViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenPackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
