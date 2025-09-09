import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DddPerth2025Component } from './ddd-perth2025.component';

describe('DddPerth2025Component', () => {
  let component: DddPerth2025Component;
  let fixture: ComponentFixture<DddPerth2025Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DddPerth2025Component]
    });
    fixture = TestBed.createComponent(DddPerth2025Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
