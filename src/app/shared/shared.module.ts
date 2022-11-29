import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopNavComponent } from './top-nav/top-nav.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from '../app-routing.module';
import { CardSliderComponent } from './card-slider/card-slider.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { LoadingOverlayAccountComponent } from './loading-overlay-account/loading-overlay-account.component';
import { Filter1Component } from './filter1/filter1.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TopNavComponent,
    FooterComponent,
    CardComponent,
    CardSliderComponent,
    LoadingOverlayComponent,
    LoadingOverlayAccountComponent,
    Filter1Component,
    SearchbarComponent,
  ],
  exports:[
    TopNavComponent,
    FooterComponent,
    CardComponent,
    CardSliderComponent,
    LoadingOverlayComponent,
    LoadingOverlayAccountComponent,
    SearchbarComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    TranslateModule
  ]
})
export class SharedModule { }
