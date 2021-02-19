import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCalendarPageRoutingModule } from './edit-calendar-routing.module';

import { EditCalendarPage } from './edit-calendar.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCalendarPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditCalendarPage]
})
export class EditCalendarPageModule {}
