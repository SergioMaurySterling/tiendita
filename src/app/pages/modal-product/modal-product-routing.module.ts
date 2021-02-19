import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalProductPage } from './modal-product.page';

const routes: Routes = [
  {
    path: '',
    component: ModalProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalProductPageRoutingModule {}
