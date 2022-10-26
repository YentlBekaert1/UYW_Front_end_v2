import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestPaginaModule } from './test-pagina/test-pagina.module';
import { TestPaginaModuleV2 } from './test-pagina-v2/test-pagina.module';
import { TestPaginaModuleV3 } from './test-pagina-v3/test-pagina.module';
import { ItemsPageModule } from './items-page/items-page.module';
import { HomePageModule } from './home-page/home-page.module';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { XsrfInterceptor } from './_helpers/http.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageModule } from './login-page/login-page.module';
import { SharedModule } from './shared/shared.module';
import { RegisterPageModule } from './register-page/register-page.module';
import { AccountPageModule } from './account-page/account-page.module';
import { AddOfferPageModule } from './add-offer-page/add-offer-page.module';

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
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPageModule,
    RegisterPageModule,
    AccountPageModule,
    AddOfferPageModule,
    SharedModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: XsrfInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
