import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponentV2 } from './home.component';

describe('HomeComponentV2', () => {
  let component: HomeComponentV2;
  let fixture: ComponentFixture<HomeComponentV2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponentV2]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponentV2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
