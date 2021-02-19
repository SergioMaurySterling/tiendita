import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetModalPage } from './vet-modal.page';

const routes: Routes = [
  {
    path: '',
    component: VetModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetModalPageRoutingModule {}
