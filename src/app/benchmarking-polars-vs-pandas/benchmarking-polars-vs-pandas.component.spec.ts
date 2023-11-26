import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkingPolarsVsPandasComponent } from './benchmarking-polars-vs-pandas.component';

describe('BenchmarkingPolarsVsPandasComponent', () => {
  let component: BenchmarkingPolarsVsPandasComponent;
  let fixture: ComponentFixture<BenchmarkingPolarsVsPandasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BenchmarkingPolarsVsPandasComponent]
    });
    fixture = TestBed.createComponent(BenchmarkingPolarsVsPandasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
