import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewportScroller } from "@angular/common";

import * as d3 from "d3"

@Component({
  selector: 'app-time-range-transformations',
  templateUrl: './time-range-transformations.component.html',
  styleUrls: ['./time-range-transformations.component.css']
})
export class TimeRangeTransformationsComponent implements OnInit {

    constructor(private viewportScroller: ViewportScroller) {
        this.viewportScroller.setOffset([0,40])
    }

    ngOnInit() {

    }

    scrollToSelector(id: string) {
        this.viewportScroller.scrollToAnchor(id)
    }
}
