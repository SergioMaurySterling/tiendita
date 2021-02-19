import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartmodalPage } from './cartmodal.page';

const routes: Routes = [
  {
    path: '',
    component: CartmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartmodalPageRoutingModule {}
