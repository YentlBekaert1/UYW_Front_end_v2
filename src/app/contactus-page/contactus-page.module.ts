import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactusPageComponent } from './contactus-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ContactusPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class ContactusPageModule { }
