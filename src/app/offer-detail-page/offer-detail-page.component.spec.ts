import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailPageComponent } from './offer-detail-page.component';

describe('OfferDetailPageComponent', () => {
  let component: OfferDetailPageComponent;
  let fixture: ComponentFixture<OfferDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
