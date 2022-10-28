import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOfferPageComponent } from './add-offer-page.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddOfferPageComponent,
    DragDropFileUploadDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddOfferPageModule { }
