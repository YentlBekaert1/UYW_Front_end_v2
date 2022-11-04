import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';
import { MyItemsComponent } from './my-items/my-items.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './logout/logout.component';



@NgModule({
  declarations: [
    AccountPageComponent,
    MyProfileComponent,
    MyFavoritesComponent,
    MyItemsComponent,
    SettingsComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ]
})
export class AccountPageModule { }
