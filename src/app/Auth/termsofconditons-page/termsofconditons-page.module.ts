import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsofconditonsComponent } from './termsofconditons.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    TermsofconditonsComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule
  ]
})
export class TermsofconditonsPageModule { }
