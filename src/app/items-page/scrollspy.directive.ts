import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appScroll]'
})
export class ScrollSpyDirective {

    @Input() active_tab!: any;

    constructor(private el: ElementRef) {}

    @HostListener("window:scroll", ["$event"])
    onScroll(event: any) {
      //console.log(event.target.scrollingElement.scrollTop, this.el.nativeElement);
      if(this.active_tab  == 'combi'){
        if(window.innerWidth > 1010){
          var scrollPosition = event.target.scrollingElement.scrollTop || document.body.scrollTop;
          var filtersEl = this.el.nativeElement.querySelector('.filters');
          var mapEl = this.el.nativeElement.querySelector('.property-map');
          var listEl = this.el.nativeElement.querySelector('.property-list');
          //console.log(filtersEl, mapEl, gridEl);
          var scrollBottomPosition =  this.el.nativeElement.querySelector('#scrollBottom').offsetTop;
          //console.log(scrollPosition + window.innerHeight > scrollBottomPosition , scrollPosition + window.innerHeight  , scrollBottomPosition);

          if(scrollPosition > 0 && scrollPosition + window.innerHeight + 1 < scrollBottomPosition){
            filtersEl.classList.add('fixed');
              mapEl.classList.add('fixed');
              mapEl.classList.remove('bottom');
              mapEl.style.top = (filtersEl.clientHeight + 100).toString() + "px";
              listEl.style.marginTop = (filtersEl.clientHeight).toString() + "px";
          }
          else if(scrollPosition + window.innerHeight  > scrollBottomPosition){
              mapEl.classList.remove('fixed');
              mapEl.classList.add('bottom');
              mapEl.style.top = "auto";
              listEl.style.marginTop = "0px";
          }
          else{
              filtersEl.classList.remove('fixed');
              mapEl.classList.remove('fixed');
              mapEl.classList.remove('bottom');
              mapEl.style.top = "auto";
              listEl.style.marginTop = "0px";
          }

        }
      }
      }


}

// var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

// var el = document.getElementsByClassName('filters');
// var map = document.getElementsByClassName('property-map');
// var grid = document.getElementsByClassName('cards');
// var scrollBottomPosition = document.getElementById('scrollBottom').offsetTop;

// console.log(scrollPosition + window.innerHeight > scrollBottomPosition , scrollPosition + window.innerHeight  , scrollBottomPosition);

// if(scrollPosition > 100 && scrollPosition + window.innerHeight + 1 < scrollBottomPosition){
//     el[0].classList.add('fixed');
//     mapEl.classList.add('fixed');
//     mapEl.classList.remove('bottom');
//     mapEl.style.top = (el[0].clientHeight + 20).toString() + "px";
// }
// else if(scrollPosition + window.innerHeight > scrollBottomPosition){
//     mapEl.classList.remove('fixed');
//     mapEl.classList.add('bottom');
//     mapEl.style.top = "auto";
// }
// else{
//     el[0].classList.remove('fixed');
//     mapEl.classList.remove('fixed');
//     mapEl.style.top = "auto";
// }
