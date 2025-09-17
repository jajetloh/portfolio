import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-ddd-perth2025',
  templateUrl: './ddd-perth2025.component.html',
  styleUrls: ['./ddd-perth2025.component.css']
})
export class DddPerth2025Component {

    @ViewChild('slides') slides!: ElementRef<HTMLIFrameElement>

    constructor(private viewportScroller: ViewportScroller) {
        this.viewportScroller.setOffset([0,40])
    }
}
