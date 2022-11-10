import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;

  public accountDropdownState:boolean = false;
  public responsiveNavState:boolean = false;

  fullNavState = true;
  public innerWidth: any;

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 1340){
      this.fullNavState = false;
    }
    else{
      this.fullNavState = true;
      this.responsiveNavState = false;
    }
  }
  searchClicked(){
    console.log(this.searchInput.nativeElement.value);
  }

  accountButtonClicked(){
    this.accountDropdownState = !this.accountDropdownState;
  }
  dropdowncontainerClicked(){
    this.accountDropdownState = !this.accountDropdownState;
  }

  toggleResponsiveNav(){
   this.responsiveNavState = !this.responsiveNavState;
  }
  responsiveNavitemClicked(){
    this.responsiveNavState = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {

    if(this.eRef.nativeElement.contains(event.target)) {
      console.log("clicked inside");
    } else {
      console.log("clicked outside");
      this.accountDropdownState = false;
      this.responsiveNavState = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 1340){
      this.fullNavState = false;
    }
    else{
      this.fullNavState = true;
      this.responsiveNavState = false;
    }
  }

}
