import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMapViewComponent } from './list-map-view.component';

describe('ListMapViewComponent', () => {
  let component: ListMapViewComponent;
  let fixture: ComponentFixture<ListMapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMapViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
