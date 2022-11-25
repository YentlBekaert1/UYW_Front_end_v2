import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { Profile } from 'src/app/store/authstate/auth.model';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { changeLang } from 'src/app/store/languagestate/load.actions';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  public accountDropdownState:boolean = false;
  public responsiveNavState:boolean = false;
  public accountresponsiveState:boolean = false;

  fullNavState = true;

  public innerWidth: any;

  @Input() profile: Profile;
  @Input() userLoggedIn: Boolean;
  @Input() languageSelected: string;

  @ViewChild('flag', { read: ElementRef }) flag!: ElementRef<HTMLInputElement>;

  constructor(private eRef: ElementRef, public translate: TranslateService, private store: Store) {}

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

  switchLang(event) {
    console.log(event.target.value);
    this.translate.use(event.target.value);
    this.flag.nativeElement.src = "../../../assets/flags/"+event.target.value+".svg"
    this.store.dispatch(changeLang({lang: event.target.value}));
  }

}
