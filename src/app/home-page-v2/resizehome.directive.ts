import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appHomeResize]'
})
export class ResizeHomeDirective {

    constructor(private el: ElementRef) {}

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
      //console.log(this.el.nativeElement.querySelector('#aarde_container'), event.target.innerWidth, event.target.innerHeight);
      if(window.innerWidth > 1340){
        console.log('resize');
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        var aspectratio = (window.innerWidth/window.innerHeight);
        var width = (event.target.innerWidth * 1.2)/aspectratio;
        var height = width;

        aardbol.style.width = ((width).toFixed()).toString() + "px";
        aardbol.style.height = ((height).toFixed()).toString() + "px";
      }else{
          var aardbol = this.el.nativeElement.querySelector('#aarde_container');
          var aspectratio = (window.innerWidth/window.innerHeight);
          var width = (event.target.innerWidth * 0.5)/aspectratio;
          var height = width;

          aardbol.style.width = ((width).toFixed()).toString() + "px";
          aardbol.style.height = ((height).toFixed()).toString() + "px";
      }

    }

}
