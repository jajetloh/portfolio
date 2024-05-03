import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    BenchmarkingPolarsVsPandasComponent
} from "./benchmarking-polars-vs-pandas/benchmarking-polars-vs-pandas.component"
import { PortfolioComponent } from "./portfolio/portfolio.component"

const routes: Routes = [
    { path: '', component: PortfolioComponent, title: 'Ja-Jet Loh' },
    { path: 'benchmarking-polars-vs-pandas', component: BenchmarkingPolarsVsPandasComponent, title: 'Benchmarking Polars vs Pandas' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
