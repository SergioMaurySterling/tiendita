import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdopcionPage } from './adopcion.page';

const routes: Routes = [
  {
    path: '',
    component: AdopcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdopcionPageRoutingModule {}
