import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactusPageComponent } from './contactus-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContactusPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ContactusPageModule { }
