import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appHomeResize]'
})
export class ResizeHomeDirective {

    constructor(private el: ElementRef) {}

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
      //console.log(this.el.nativeElement.querySelector('#aarde_container'), event.target.innerWidth, event.target.innerHeight);
      //console.log(window.innerWidth)
      if(window.innerWidth < 600){
        console.log('resize');
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        aardbol.style.top = ((window.innerHeight-300).toFixed()).toString() + "px";
      }
      else if(window.innerWidth > 600 && window.innerWidth < 1340){
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        aardbol.style.top = ((window.innerHeight-400).toFixed()).toString() + "px";
      }
      else if(window.innerWidth > 1340 && window.innerWidth < 1450){
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        aardbol.style.top = "25vh";
      }
      else if(window.innerWidth > 1450 && window.innerWidth < 1600){
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        aardbol.style.top = "20vh";
      }
      else if(window.innerWidth > 1600){
        console.log(20)
        var aardbol = this.el.nativeElement.querySelector('#aarde_container');
        aardbol.style.top = "10vh";
      }
      //else{
      //     var aardbol = this.el.nativeElement.querySelector('#aarde_container');
      //     var aspectratio = (window.innerWidth/window.innerHeight);
      //     var width = (event.target.innerWidth * 0.5)/aspectratio;
      //     var height = width;

      //     aardbol.style.width = ((width).toFixed()).toString() + "px";
      //     aardbol.style.height = ((height).toFixed()).toString() + "px";
      // }

    }

}
