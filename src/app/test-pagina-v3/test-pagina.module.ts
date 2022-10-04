import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponentV3 } from './home/home.component';
import { MapComponent } from './components/map/map.component';
import { CategoryButtonsComponent } from './components/category-buttons/category-buttons.component';
import { MapRadiusFilterComponent } from './components/map-radius-filter/map-radius-filter.component';
import { ListDisplayComponent } from './components/list-display/list-display.component';

import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { MapViewComponent } from './views/map-view/map-view.component';
import { ListMapViewComponent } from './views/list-map-view/list-map-view.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollSpyDirective } from './scroll.spy.directive';

@NgModule({
  declarations: [
    HomeComponentV3,
    MapComponent,
    CategoryButtonsComponent,
    MapRadiusFilterComponent,
    ListDisplayComponent,
    CardComponent,
    MapViewComponent,
    ListMapViewComponent,
    TabsComponent,
    FooterComponent,
    ScrollSpyDirective
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
