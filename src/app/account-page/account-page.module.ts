import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AccountPageModule { }
