import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopNavComponent } from './top-nav/top-nav.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from '../app-routing.module';
import { CardSliderComponent } from './card-slider/card-slider.component';

@NgModule({
  declarations: [
    TopNavComponent,
    FooterComponent,
    CardComponent,
    CardSliderComponent
  ],
  exports:[
    TopNavComponent,
    FooterComponent,
    CardComponent,
    CardSliderComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ]
})
export class SharedModule { }