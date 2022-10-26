import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './test-pagina/home/home.component';
import { HomeComponentV2 } from './test-pagina-v2/home/home.component';
import { HomeComponentV3 } from './test-pagina-v3/home/home.component';
import { ItemsPageComponent } from './items-page/items-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AccountPageComponent } from './account-page/account-page.component';
import { AddOfferPageComponent } from './add-offer-page/add-offer-page.component';


const routes: Routes = [
    {
    path: "home",
    component: HomePageComponent,

  },
  {
    path: "home2",
    component: HomeComponentV2,
  },
  {
    path: "home3",
    component: HomeComponentV3,
  },
  {
    path: "items",
    component: ItemsPageComponent,
  },
  {
    path: "account",
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "addoffer",
    component: AddOfferPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "register",
    component: RegisterPageComponent,
  },
  {
      path: "**",
      redirectTo: "home",
      pathMatch: 'full'
  },
  {
      path: "",
      redirectTo: "home",
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[
    AuthGuard
  ]
})
export class AppRoutingModule { }
