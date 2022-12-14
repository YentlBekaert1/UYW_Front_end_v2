import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQPageComponent } from '../faq-page/faq-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    FAQPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule,
    MatExpansionModule
  ]
})
export class FAQPageModule { }
