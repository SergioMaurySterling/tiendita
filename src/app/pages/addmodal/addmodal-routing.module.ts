import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddmodalPage } from './addmodal.page';

const routes: Routes = [
  {
    path: '',
    component: AddmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddmodalPageRoutingModule {}
