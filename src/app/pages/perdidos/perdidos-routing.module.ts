import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerdidosPage } from './perdidos.page';

const routes: Routes = [
  {
    path: '',
    component: PerdidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerdidosPageRoutingModule {}
