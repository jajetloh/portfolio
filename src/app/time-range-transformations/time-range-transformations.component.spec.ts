import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeTransformationsComponent } from './time-range-transformations.component';

describe('TimeRangeTransformationsComponent', () => {
  let component: TimeRangeTransformationsComponent;
  let fixture: ComponentFixture<TimeRangeTransformationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRangeTransformationsComponent]
    });
    fixture = TestBed.createComponent(TimeRangeTransformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
