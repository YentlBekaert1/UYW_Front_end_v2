import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectisLoggedIn, selectProfile } from './store/authstate/auth.selector';
import { BooleanisLoaded } from './store/loadstate/load.selector';
import { UserAccount } from './_models/user';
import { TranslateService } from '@ngx-translate/core';
import { changeLang } from './store/languagestate/load.actions';
import { selectedLang } from './store/languagestate/lang.selector';
import { CategoryService } from './_services/category.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  user!: UserAccount;
  profile$ = this.store.select(selectProfile);
  userLoggedIn$ = this.store.select(selectisLoggedIn);
  loadState$ = this.store.select(BooleanisLoaded);
  lang = this.store.select(selectedLang);

  selectedlanguage: string = "fr";
  constructor(private store: Store, public translate: TranslateService, private category_service: CategoryService){
    this.translate.addLangs(['en', 'nl', 'fr']);

    this.getUsersLocale("en").then((res) => {
      //console.log(res)
      if(res == 'nl'){
        this.translate.setDefaultLang('nl');
        this.selectedlanguage = 'nl'
        this.store.dispatch(changeLang({lang: 'nl'}));
      }else if(res == 'en'){
        this.translate.setDefaultLang('en');
        this.selectedlanguage = 'en'
        this.store.dispatch(changeLang({lang: 'en'}));
      }else if(res == 'fr'){
        this.translate.setDefaultLang('fr');
        this.selectedlanguage = 'fr';
        this.store.dispatch(changeLang({lang: 'fr'}));
      }
      else{
        this.translate.setDefaultLang('en');
        this.selectedlanguage = 'en'
        this.store.dispatch(changeLang({lang: 'en'}));
      }
    });
    this.category_service.getCategories();
  }

  async getUsersLocale(defaultValue: string) {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return defaultValue;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }


}
