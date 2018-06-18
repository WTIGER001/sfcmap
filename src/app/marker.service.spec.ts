import { TestBed, inject } from '@angular/core/testing';

import { MarkerService } from './marker.service';

describe('MarkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkerService]
    });
  });

  it('should be created', inject([MarkerService], (service: MarkerService) => {
    expect(service).toBeTruthy();
  }));
});
