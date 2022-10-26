import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOfferPageComponent } from './add-offer-page.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AddOfferPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AddOfferPageModule { }
