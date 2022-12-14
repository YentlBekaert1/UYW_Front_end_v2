import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDetailPageComponent } from './offer-detail-page.component';
import { SharedModule } from '../shared/shared.module';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { DetailMapComponent } from './detail-map/detail-map.component';
import { TranslateModule } from '@ngx-translate/core'


@NgModule({
  declarations: [
    OfferDetailPageComponent,
    ImageSliderComponent,
    DetailMapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule
  ]
})
export class OfferDetailPageModule { }
