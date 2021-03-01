import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminosPage } from './terminos.page';

const routes: Routes = [
  {
    path: '',
    component: TerminosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminosPageRoutingModule {}
