import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { TopNavComponent } from './components/top-nav/top-nav.component';
import { ItemsPageComponent } from './items-page.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { MapRadiusFilterComponent } from './components/map-radius-filter/map-radius-filter.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapComponent } from './components/map/map.component';
import { ListDisplayComponent } from './components/list-display/list-display.component';
import { CardComponent } from './components/card/card.component';
import { ScrollSpyDirective } from './scrollspy.directive';
import { ResizeDirective } from './resize.directive';

@NgModule({
  declarations: [
    TopNavComponent,
    ItemsPageComponent,
    CategoryButtonsComponent,
    MapRadiusFilterComponent,
    TabsComponent,
    FooterComponent,
    MapComponent,
    ListDisplayComponent,
    CardComponent,
    ScrollSpyDirective,
    ResizeDirective
  ],
  imports: [
    CommonModule,
    BrowserModule
  ]
})
export class ItemsPageModule { }
