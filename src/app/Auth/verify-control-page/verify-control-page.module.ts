import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyControlComponent } from './verify-control.component';
import { AppRoutingModule } from '../../app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    VerifyControlComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ]
})
export class VerifyControlPageModule { }
