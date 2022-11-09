import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordComponent } from './forget-password.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class ForgetPasswordModule { }
