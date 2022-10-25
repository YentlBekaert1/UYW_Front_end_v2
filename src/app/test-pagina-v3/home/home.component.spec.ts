import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentV3 } from './home.component';

describe('HomeComponentV3', () => {
  let component: HomeComponentV3;
  let fixture: ComponentFixture<HomeComponentV3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponentV3]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponentV3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
