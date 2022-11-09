import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenPageComponent } from './forbidden-page.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    ForbiddenPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class ForbiddenPageModule { }
