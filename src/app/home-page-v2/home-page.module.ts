import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePagev2Component } from './home-page.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { ResizeHomeDirective } from './resizehome.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HomePagev2Component,
    ResizeHomeDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule
  ]
})
export class HomePagev2Module { }
