import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appResize]'
})
export class ResizeDirective {

    @Input() mapElement!: any;

    constructor(private el: ElementRef) {}

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
      //console.log(this.el.nativeElement.querySelector('.property-map'), this.mapElement, event.target.innerWidth);
      var mapEl = this.el.nativeElement.querySelector('.property-map');
      var listEl = this.el.nativeElement.querySelector('.property-list');
      mapEl.style.width = ((event.target.innerWidth - listEl.clientWidth).toFixed()).toString() + "px";
      mapEl.style.height = (event.target.innerHeight - 250).toString() + "px";
    }

}
