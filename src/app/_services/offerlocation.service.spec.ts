import { TestBed } from '@angular/core/testing';

import { OfferlocationService } from './offerlocation.service';

describe('OfferlocationService', () => {
  let service: OfferlocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferlocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
