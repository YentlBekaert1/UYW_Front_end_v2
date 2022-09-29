import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './components/map/map.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { MapRadiusFilterComponent } from './components/map-radius-filter/map-radius-filter.component';
import { ListDisplayComponent } from './components/list-display/list-display.component';

@NgModule({
  declarations: [
    HomeComponent,
    MapComponent,
    CategoryButtonsComponent,
    MapRadiusFilterComponent,
    ListDisplayComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HomeComponent
  ]
})
export class TestPaginaModule { }
