import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditpublicationPage } from './editpublication.page';

const routes: Routes = [
  {
    path: '',
    component: EditpublicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditpublicationPageRoutingModule {}
