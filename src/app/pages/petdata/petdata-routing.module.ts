import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetdataPage } from './petdata.page';

const routes: Routes = [
  {
    path: '',
    component: PetdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetdataPageRoutingModule {}
