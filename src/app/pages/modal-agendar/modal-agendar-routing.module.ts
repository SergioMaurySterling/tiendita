import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAgendarPage } from './modal-agendar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAgendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAgendarPageRoutingModule {}
