import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestPaginaModule } from './test-pagina/test-pagina.module';
import { TestPaginaModuleV2 } from './test-pagina-v2/test-pagina.module';
import { TestPaginaModuleV3 } from './test-pagina-v3/test-pagina.module';
import { ItemsPageModule } from './items-page/items-page.module';
import { HomePageModule } from './home-page/home-page.module';


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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
