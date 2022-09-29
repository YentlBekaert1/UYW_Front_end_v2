import { TestBed } from '@angular/core/testing';

import { GeosearchService } from './geosearch.service';

describe('MapboxgeosearchService', () => {
  let service: GeosearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeosearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
