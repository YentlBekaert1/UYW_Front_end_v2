import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditOfferPageComponent } from './edit-offer-page.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {TranslateModule} from '@ngx-translate/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    EditOfferPageComponent,
    DragDropFileUploadDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AngularEditorModule,
    TranslateModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatTableModule
  ]
})
export class EditOfferPageModule { }
