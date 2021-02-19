import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVetPage } from './add-vet.page';

const routes: Routes = [
  {
    path: '',
    component: AddVetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVetPageRoutingModule {}
