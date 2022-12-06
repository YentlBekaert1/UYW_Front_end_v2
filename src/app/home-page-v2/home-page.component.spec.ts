import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePagev2Component } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePagev2Component;
  let fixture: ComponentFixture<HomePagev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePagev2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePagev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
