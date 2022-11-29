import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageComponent } from './account-page.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';
import { DeleteDialog, MyItemsComponent, StatusDialog } from './my-items/my-items.component';
import { DeleteUserDialog, SettingsComponent } from './settings/settings.component';
import { LogoutComponent } from './logout/logout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MatTableModule} from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AccountPageComponent,
    MyProfileComponent,
    MyFavoritesComponent,
    MyItemsComponent,
    SettingsComponent,
    LogoutComponent,
    DeleteDialog,
    StatusDialog,
    DeleteUserDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    MatTableModule,
    NgxChartsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatMenuModule,
  ]
})
export class AccountPageModule { }
