import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetshopPage } from './petshop.page';

const routes: Routes = [
  {
    path: '',
    component: PetshopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetshopPageRoutingModule {}
