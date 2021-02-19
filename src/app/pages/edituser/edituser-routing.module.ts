import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EdituserPage } from './edituser.page';

const routes: Routes = [
  {
    path: '',
    component: EdituserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdituserPageRoutingModule {}
