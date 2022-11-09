import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsofconditonsComponent } from './termsofconditons.component';

describe('TermsofconditonsComponent', () => {
  let component: TermsofconditonsComponent;
  let fixture: ComponentFixture<TermsofconditonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsofconditonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsofconditonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
