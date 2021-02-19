import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetPage } from './vet.page';

const routes: Routes = [
  {
    path: '',
    component: VetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetPageRoutingModule {}
