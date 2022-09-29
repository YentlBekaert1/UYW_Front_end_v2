import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRadiusFilterComponent } from './map-radius-filter.component';

describe('MapRadiusFilterComponent', () => {
  let component: MapRadiusFilterComponent;
  let fixture: ComponentFixture<MapRadiusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapRadiusFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRadiusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
