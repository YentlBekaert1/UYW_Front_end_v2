import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerfiyPageComponent } from './email-verfiy-page.component';

describe('EmailVerfiyPageComponent', () => {
  let component: EmailVerfiyPageComponent;
  let fixture: ComponentFixture<EmailVerfiyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailVerfiyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerfiyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
