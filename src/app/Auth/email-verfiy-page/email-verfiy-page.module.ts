import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailVerfiyPageComponent } from './email-verfiy-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';



@NgModule({
  declarations: [
    EmailVerfiyPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class EmailVerfiyPageModule { }
