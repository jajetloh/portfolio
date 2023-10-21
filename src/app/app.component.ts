import { Component } from '@angular/core'
import { MatChipListboxChange } from "@angular/material/chips"
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

enum FilterValues {
    LearningResource = 'Learning Resource',
    Code = 'Code',
    Application = 'Application',
    ResearchThesis = 'Document',
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'portfolio-app'

    FilterValues = FilterValues


    filterValue?: FilterValues

    faLinkIcon = faArrowUpRightFromSquare


    applyFilter(event: MatChipListboxChange) {
        this.filterValue = (event.value as FilterValues | undefined)
    }
}
