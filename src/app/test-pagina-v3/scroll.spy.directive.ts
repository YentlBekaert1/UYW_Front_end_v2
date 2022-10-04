import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appScroll]'
})
export class ScrollSpyDirective {


    constructor() {}

    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
      console.log('hello')
    }


}
