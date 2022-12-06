import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForbiddenPageComponent } from './forbidden-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    ForbiddenPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class ForbiddenPageModule { }
