import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoupetPage } from './coupet.page';

const routes: Routes = [
  {
    path: '',
    component: CoupetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoupetPageRoutingModule {}
