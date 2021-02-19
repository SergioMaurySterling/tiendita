import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterempPage } from './registeremp.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterempPageRoutingModule {}
