import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    BenchmarkingPolarsVsPandasComponent
} from "./benchmarking-polars-vs-pandas/benchmarking-polars-vs-pandas.component"
import { PortfolioComponent } from "./portfolio/portfolio.component"
import { TimeRangeTransformationsComponent } from "./time-range-transformations/time-range-transformations.component";
import { DddPerth2025Component } from "./ddd-perth2025/ddd-perth2025.component";

const routes: Routes = [
    { path: '', component: PortfolioComponent, title: 'Ja-Jet Loh' },
    { path: 'benchmarking-polars-vs-pandas', component: BenchmarkingPolarsVsPandasComponent, title: 'Benchmarking Polars vs Pandas' },
    { path: 'time-range-transformations', component: TimeRangeTransformationsComponent, title: 'Time Range Transformations' },
    { path: 'ddd-perth-2025', component: DddPerth2025Component, title: 'FOSS and My Journey to Building Impactful Software' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
