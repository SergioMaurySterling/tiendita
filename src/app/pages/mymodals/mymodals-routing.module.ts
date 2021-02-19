import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MymodalsPage } from './mymodals.page';

const routes: Routes = [
  {
    path: '',
    component: MymodalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MymodalsPageRoutingModule {}
