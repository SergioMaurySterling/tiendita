import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCalendarPage } from './edit-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: EditCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCalendarPageRoutingModule {}
