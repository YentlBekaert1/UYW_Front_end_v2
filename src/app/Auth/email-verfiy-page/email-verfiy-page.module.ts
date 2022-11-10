import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailVerfiyPageComponent } from './email-verfiy-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../../app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EmailVerfiyPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule
  ]
})
export class EmailVerfiyPageModule { }
