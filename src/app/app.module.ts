import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestPaginaModule } from './test-pagina/test-pagina.module';
import { TestPaginaModuleV2 } from './test-pagina-v2/test-pagina.module';
import { TestPaginaModuleV3 } from './test-pagina-v3/test-pagina.module';
import { ItemsPageModule } from './items-page/items-page.module';
import { HomePageModule } from './home-page/home-page.module';
import { HttpClient, HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { XsrfInterceptor } from './_helpers/http.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageModule } from './Auth/login-page/login-page.module';
import { SharedModule } from './shared/shared.module';
import { RegisterPageModule } from './Auth/register-page/register-page.module';
import { AccountPageModule } from './account-page/account-page.module';
import { AddOfferPageModule } from './add-offer-page/add-offer-page.module';
import { OfferDetailPageModule } from './offer-detail-page/offer-detail-page.module';
import { EditOfferPageModule } from './edit-offer-page/edit-offer-page.module';
import { ForgetPasswordModule } from './Auth/forget-password/forget-password.module';
import { ResetPasswordModule } from './Auth/reset-password/reset-password.module';
import { EmailVerfiyPageModule } from './Auth/email-verfiy-page/email-verfiy-page.module';
import { VerifyControlPageModule } from './Auth/verify-control-page/verify-control-page.module';
import { ForbiddenPageModule } from './forbidden-page/forbidden-page.module';
import { TermsofconditonsPageModule } from './Auth/termsofconditons-page/termsofconditons-page.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/authstate/auth.effects';
import { AuthReducer } from './store/authstate/auth.reducer';
import { LoadReducer } from './store/loadstate/load.reducer';
import { AuthGuard } from './_helpers/auth.guard';
import { FilterReducer } from './store/filterstate/filter.reducers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePagev2Module } from './home-page-v2/home-page.module';
import { SearchPageModule } from './search-page/search-page.module';
import { ProfileGuard } from './_helpers/profile.guard';
import { MatDialogModule } from '@angular/material/dialog';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageReducer } from './store/languagestate/lang.reducer';
import { CategoryReducer } from './store/categorystate/category.reducer';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HotToastModule } from '@ngneat/hot-toast'; //https://ngneat.github.io/hot-toast/
import { FAQPageModule } from './faq-page/faq-page.module';
import { ContactusPageModule } from './contactus-page/contactus-page.module';
import { FeedbackPageModule } from './feedback-page/feedback-page.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestPaginaModule,
    TestPaginaModuleV2,
    TestPaginaModuleV3,
    ItemsPageModule,
    HomePageModule,
    HomePagev2Module,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPageModule,
    RegisterPageModule,
    AccountPageModule,
    AddOfferPageModule,
    OfferDetailPageModule,
    SearchPageModule,
    EditOfferPageModule,
    ForgetPasswordModule,
    ResetPasswordModule,
    EmailVerfiyPageModule,
    SharedModule,
    VerifyControlPageModule,
    ForbiddenPageModule,
    TermsofconditonsPageModule,
    FAQPageModule,
    ContactusPageModule,
    FeedbackPageModule,
    StoreModule.forRoot({Authdata: AuthReducer, LoadData: LoadReducer, FilterData: FilterReducer, LangData: LanguageReducer, CategoryData: CategoryReducer}, {}),
    EffectsModule.forRoot([AuthEffects]),
    BrowserAnimationsModule,
    MatDialogModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoader,
          deps: [HttpClient]
      }
    }),
    NgxChartsModule,
    HotToastModule.forRoot()
  ],
  providers: [
    AuthGuard,
    ProfileGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AOT compilation support
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
