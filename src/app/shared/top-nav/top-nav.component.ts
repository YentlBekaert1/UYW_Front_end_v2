import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/store/authstate/auth.model';



@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  @ViewChild('searchInput', { read: ElementRef }) searchInput!: ElementRef<HTMLInputElement>;

  public accountDropdownState:boolean = false;
  public responsiveNavState:boolean = false;
  public accountresponsiveState:boolean = false;

  fullNavState = true;

  public innerWidth: any;

  @Input() profile: Profile;
  @Input() userLoggedIn: Boolean;

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
    this.accountresponsiveState = false;
  }
  responsiveAccountButtonClicked(){
    this.accountresponsiveState = !this.accountresponsiveState;
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
    } else {
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
