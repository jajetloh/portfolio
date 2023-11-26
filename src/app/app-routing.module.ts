import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    BenchmarkingPolarsVsPandasComponent
} from "./benchmarking-polars-vs-pandas/benchmarking-polars-vs-pandas.component"
import { PortfolioComponent } from "./portfolio/portfolio.component"

const routes: Routes = [
    { path: '', component: PortfolioComponent },
    { path: 'benchmarking-polars-vs-pandas', component: BenchmarkingPolarsVsPandasComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
