import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersAliadPage } from './users-aliad.page';

const routes: Routes = [
  {
    path: '',
    component: UsersAliadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersAliadPageRoutingModule {}
