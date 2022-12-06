import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './search-page.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SearchPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SearchPageModule { }
