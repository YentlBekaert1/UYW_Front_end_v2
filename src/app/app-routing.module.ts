import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './test-pagina/home/home.component';
import { HomeComponentV2 } from './test-pagina-v2/home/home.component';
import { HomeComponentV3 } from './test-pagina-v3/home/home.component';

const routes: Routes = [
  {
    path: "home1",
    component: HomeComponent,
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
      path: "**",
      redirectTo: "home1",
      pathMatch: 'full'
  },
  {
      path: "",
      redirectTo: "home1",
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
