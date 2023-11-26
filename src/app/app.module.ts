import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatChipsModule } from "@angular/material/chips";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule } from "./app-routing.module";
import { BenchmarkingPolarsVsPandasComponent } from './benchmarking-polars-vs-pandas/benchmarking-polars-vs-pandas.component';
import { PortfolioComponent } from './portfolio/portfolio.component'
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs"

@NgModule({
    declarations: [
        AppComponent,
        BenchmarkingPolarsVsPandasComponent,
        PortfolioComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatChipsModule,
        FontAwesomeModule,
        AppRoutingModule,
        HighlightModule,
    ],
    providers: [
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, only if you want the line numbers
                languages: {
                    python: () => import('highlight.js/lib/languages/python')
                }
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
