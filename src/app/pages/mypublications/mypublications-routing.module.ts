import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypublicationsPage } from './mypublications.page';

const routes: Routes = [
  {
    path: '',
    component: MypublicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MypublicationsPageRoutingModule {}
