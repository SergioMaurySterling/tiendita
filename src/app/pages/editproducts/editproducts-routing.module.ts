import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditproductsPage } from './editproducts.page';

const routes: Routes = [
  {
    path: '',
    component: EditproductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditproductsPageRoutingModule {}
