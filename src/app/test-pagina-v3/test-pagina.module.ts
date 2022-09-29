import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponentV3 } from './home/home.component';
import { MapComponent } from './components/map/map.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { MapRadiusFilterComponent } from './components/map-radius-filter/map-radius-filter.component';
import { ListDisplayComponent } from './components/list-display/list-display.component';

import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [
    HomeComponentV3,
    MapComponent,
    CategoryButtonsComponent,
    MapRadiusFilterComponent,
    ListDisplayComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    HomeComponentV3
  ]
})
export class TestPaginaModuleV3 { }
