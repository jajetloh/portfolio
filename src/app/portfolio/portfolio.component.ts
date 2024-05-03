import {Component, OnInit} from '@angular/core';
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { MatChipListboxChange } from "@angular/material/chips"
import {ViewportScroller} from "@angular/common";

enum FilterValues {
    LearningResource = 'Learning Resource',
    Code = 'Code',
    Application = 'Application',
    ResearchThesis = 'Document',
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

    FilterValues = FilterValues


    filterValue?: FilterValues

    faLinkIcon = faArrowUpRightFromSquare
    faLinkedIn = faLinkedin
    faGithub = faGithub

    applyFilter(event: MatChipListboxChange) {
        this.filterValue = (event.value as FilterValues | undefined)
    }

    constructor(private viewportScroller: ViewportScroller) {
        this.viewportScroller.setOffset([0,40])
    }

    ngOnInit() {
    }
}
