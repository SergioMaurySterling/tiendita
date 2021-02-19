import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCuposPage } from './edit-cupos.page';

const routes: Routes = [
  {
    path: '',
    component: EditCuposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCuposPageRoutingModule {}
