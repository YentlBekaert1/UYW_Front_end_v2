import { TestBed } from '@angular/core/testing';

import { MapboxgeosearchService } from './geosearch.service';

describe('MapboxgeosearchService', () => {
  let service: MapboxgeosearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxgeosearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
