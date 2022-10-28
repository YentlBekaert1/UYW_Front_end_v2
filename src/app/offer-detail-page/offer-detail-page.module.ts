import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDetailPageComponent } from './offer-detail-page.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    OfferDetailPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class OfferDetailPageModule { }
