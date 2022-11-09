import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyControlComponent } from './verify-control.component';

describe('VerifyControlComponent', () => {
  let component: VerifyControlComponent;
  let fixture: ComponentFixture<VerifyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
