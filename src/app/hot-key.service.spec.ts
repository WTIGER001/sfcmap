import { TestBed, inject } from '@angular/core/testing';

import { HotKeyService } from './hot-key.service';

describe('HotKeyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HotKeyService]
    });
  });

  it('should be created', inject([HotKeyService], (service: HotKeyService) => {
    expect(service).toBeTruthy();
  }));
});
