import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements AfterViewInit, OnInit {

  @ViewChild('tabs', { read: ElementRef }) tabs!: ElementRef<HTMLInputElement>;
  private activeTabSubject: BehaviorSubject<any>;
  active_tab$: Observable<{key: number, value: string}>;
  active_tab: any;

  timeout = null;

  tab_array: {key: number, value: string}[] = [
    { key: 1, value:"Accountoverzicht"},
    { key: 2, value:"Mijn favorieten"},
    { key: 3, value:"Mijn toegevoede items"},
    { key: 4, value:"Voeg een item toe"},
    { key: 5, value:"Instellingen"},
    { key: 6, value:"Uitloggen"},
  ];

  constructor( private route: ActivatedRoute, private router: Router, private translate: TranslateService) {
    this.activeTabSubject = new BehaviorSubject<any>({} as any);
    this.active_tab$ = this.activeTabSubject.asObservable();
    this.translate.get('ACCOUNT_PAGE').subscribe((res)=>{
      this.tab_array =  [
        { key: 1, value: res.ACCOUNT_INFO},
        { key: 2, value: res.MY_FAVORITES},
        { key: 3, value: res.MY_ITEMS},
        { key: 4, value: res.ADD_ITEM},
        { key: 5, value: res.SETTINGS},
        { key: 6, value: res.LOG_OUT},
      ];
    })

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.tab_array =  [
        { key: 1, value: event.translations.ACCOUNT_PAGE.ACCOUNT_INFO},
        { key: 2, value: event.translations.ACCOUNT_PAGE.MY_FAVORITES},
        { key: 3, value: event.translations.ACCOUNT_PAGE.MY_ITEMS},
        { key: 4, value: event.translations.ACCOUNT_PAGE.ADD_ITEM},
        { key: 5, value: event.translations.ACCOUNT_PAGE.SETTINGS},
        { key: 6, value: event.translations.ACCOUNT_PAGE.LOG_OUT},
      ];
        this.setTabActive(this.active_tab.key);
    });
  }
  ngOnInit(): void {
    window.scrollTo(0,0);
    const paramsub = this.route.paramMap.subscribe(params => {
      var tab = params.get('tab');
      var number = 0;
       if(tab === 'profile'){
         number = 1;
       }
       else if(tab === 'favorites'){
         number = 2;
       }
       else if(tab === 'items'){
        number = 3;
        }
        else if(tab === 'additem'){
        number = 4;
        }
       else if(tab === 'settings'){
        number = 5;
        }
        else if(tab === 'logout'){
          number = 6;
        }
       const found = this.tab_array.find(element => element.key === number);
       this.active_tab = found;
     });
     paramsub.unsubscribe();
  }

  ngAfterViewInit(): void {
    const paramsub = this.route.paramMap.subscribe(params => {
      var tab = params.get('tab');
      var number = 0;
       if(tab === 'profile'){
         number = 1;
       }
       else if(tab === 'favorites'){
         number = 2;
       }
       else if(tab === 'items'){
        number = 3;
      }
      else if(tab === 'additem'){
        number = 4;
        }
       else if(tab === 'settings'){
        number = 5;
        }
        else if(tab === 'logout'){
          number = 6;
        }
       const found = this.tab_array.find(element => element.key === number);
       this.active_tab = found;
       this.setTabActive(this.active_tab.key);
     });
  }


  navCLicked(number: number){
    if(number === 1){
      this.router.navigate(['account', 'profile']);
    }
    else if(number === 2){
      this.router.navigate(['account', 'favorites']);
    }
    else if(number === 3){
      this.router.navigate(['account', 'items']);
    }
    else if(number === 4){
      this.router.navigate(['addoffer']);
    }
    else if(number === 5){
      this.router.navigate(['account', 'settings']);
    }
    else if(number === 6){
      this.router.navigate(['account', 'logout']);
    }


  }
  setTabActive(tab_number: number){
    for(var i = 0; i < this.tabs.nativeElement.children.length; i++){
      this.tabs.nativeElement.children[i].classList.remove('active');
    }
    this.tabs.nativeElement.children[tab_number-1].classList.add('active');
  }

  voegtoeClicked(){
      this.router.navigate(['addoffer']);
  }
  ontdekClicked(){
    this.router.navigate(['items', 'list']);
  }
}
