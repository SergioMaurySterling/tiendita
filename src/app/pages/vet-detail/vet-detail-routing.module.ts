import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VetDetailPage } from './vet-detail.page';

const routes: Routes = [
  {
    path: '',
    component: VetDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VetDetailPageRoutingModule {}
