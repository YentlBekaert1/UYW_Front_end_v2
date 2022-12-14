import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';

import { ItemsPageComponent } from './items-page.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { MapRadiusFilterComponent } from './components/map-radius-filter/map-radius-filter.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { MapComponent } from './components/map/map.component';
import { ListDisplayComponent } from './components/list-display/list-display.component';
import { ScrollSpyDirective } from './scrollspy.directive';
import { ResizeDirective } from './resize.directive';


@NgModule({
  declarations: [
    ItemsPageComponent,
    CategoryButtonsComponent,
    MapRadiusFilterComponent,
    TabsComponent,
    MapComponent,
    ListDisplayComponent,
    ScrollSpyDirective,
    ResizeDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule
  ]
})
export class ItemsPageModule { }
