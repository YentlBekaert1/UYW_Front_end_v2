import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyControlComponent } from './verify-control.component';
import { AppRoutingModule } from '../../app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    VerifyControlComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class VerifyControlPageModule { }
