import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopNavComponent } from './top-nav/top-nav.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    TopNavComponent,
    FooterComponent,
    CardComponent
  ],
  exports:[
    TopNavComponent,
    FooterComponent,
    CardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
