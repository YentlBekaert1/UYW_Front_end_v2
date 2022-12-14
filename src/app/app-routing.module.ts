import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './test-pagina/home/home.component';
import { HomeComponentV2 } from './test-pagina-v2/home/home.component';
import { HomeComponentV3 } from './test-pagina-v3/home/home.component';
import { ItemsPageComponent } from './items-page/items-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './Auth/login-page/login-page.component';
import { RegisterPageComponent } from './Auth/register-page/register-page.component';
import { AuthGuard } from './_helpers/auth.guard';
import { AccountPageComponent } from './account-page/account-page.component';
import { AddOfferPageComponent } from './add-offer-page/add-offer-page.component';
import { OfferDetailPageComponent } from './offer-detail-page/offer-detail-page.component';
import { EditOfferPageComponent } from './edit-offer-page/edit-offer-page.component';
import { EmailVerfiyPageComponent } from './Auth/email-verfiy-page/email-verfiy-page.component';
import { VerifyControlComponent } from './Auth/verify-control-page/verify-control.component';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { TermsofconditonsComponent } from './Auth/termsofconditons-page/termsofconditons.component';
import { ForgetPasswordComponent } from './Auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { HomePagev2Component } from './home-page-v2/home-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { ProfileGuard } from './_helpers/profile.guard';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';
import { FAQPageComponent } from './faq-page/faq-page.component';
import { ContactusPageComponent } from './contactus-page/contactus-page.component';


const routes: Routes = [
  {
    path: "forbidden",
    component: ForbiddenPageComponent,
  },
  {
    path: "home",
    component: HomePagev2Component,
    canActivate: [ProfileGuard],
  },
  {
    path: "home4",
    component: HomePageComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "home2",
    component: HomeComponentV2,
    canActivate: [ProfileGuard],
  },
  {
    path: "home3",
    component: HomeComponentV3,
    canActivate: [ProfileGuard],
  },
  //items
  {
    path: "items",
    redirectTo: "/items/list",
    pathMatch: 'full'
  },
  {
    path: "items/:tab",
    component: ItemsPageComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "search",
    component: SearchPageComponent,
    canActivate: [ProfileGuard],
  },
  //account
  {
    path: "account/:tab",
    component: AccountPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "addoffer",
    pathMatch: 'full',
    component: AddOfferPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "editoffer/:id",
    component: EditOfferPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "offerdetail/:id",
    component: OfferDetailPageComponent,
    canActivate: [ProfileGuard],

  },
  //auth
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "login/:url",
    component: LoginPageComponent,
  },
  {
    path: "register",
    component: RegisterPageComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "forgetpassword",
    component: ForgetPasswordComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "password_reset/:token",
    component: ResetPasswordComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: "termsofcondition",
    component: TermsofconditonsComponent,
  },
  {
    path: "email/verify",
    component: EmailVerfiyPageComponent,
  },
  {
    path: "email/verify/:url",
    component: VerifyControlComponent,
  },
  {
    path: "contactus",
    component: ContactusPageComponent,
  },
  {
    path: "faq",
    component: FAQPageComponent,
  },
  {
    path: "feedback",
    component: FeedbackPageComponent,
  },
  {
      path: "**",
      redirectTo: "/home",
      pathMatch: 'full'
  },
  {
      path: "",
      redirectTo: "/home",
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
