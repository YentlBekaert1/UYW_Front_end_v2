import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appResize]'
})
export class ResizeDirective {

    @Input() mapElement!: any;
    @Input() active_tab!: any;

    constructor(private el: ElementRef) {}

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
      //console.log(this.el.nativeElement.querySelector('.property-map'), this.mapElement, event.target.innerWidth);
      var mapEl = this.el.nativeElement.querySelector('.property-map');
      var listEl = this.el.nativeElement.querySelector('.property-list');
      mapEl.style.top = "auto";
      mapEl.style.width = "auto";
      mapEl.style.width = ((event.target.innerWidth - listEl.clientWidth - 20).toFixed()).toString() + "px";
      mapEl.style.height = (event.target.innerHeight - 250).toString() + "px";
      if(this.active_tab === 'list'){
        listEl.style.minHeight = "906px";
        //window.scrollTo(0, 0);
      }
      else if(this.active_tab === 'map'){
        mapEl.style.width = ((window.innerWidth - 20).toFixed()).toString() + "px";
        //window.scrollTo(0, 0);
      }
      else if(this.active_tab === 'combi'){

        mapEl.style.width = ((window.innerWidth - listEl.clientWidth - 50).toFixed()).toString() + "px";
        //window.scrollTo(0, 0);
      }
    }
}
