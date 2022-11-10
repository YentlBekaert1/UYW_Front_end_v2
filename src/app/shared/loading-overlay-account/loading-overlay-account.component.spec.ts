import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingOverlayAccountComponent } from './loading-overlay-account.component';

describe('LoadingOverlayAccountComponent', () => {
  let component: LoadingOverlayAccountComponent;
  let fixture: ComponentFixture<LoadingOverlayAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingOverlayAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingOverlayAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
