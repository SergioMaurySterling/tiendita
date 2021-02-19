import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAgendarPageRoutingModule } from './modal-agendar-routing.module';

import { ModalAgendarPage } from './modal-agendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAgendarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalAgendarPage]
})
export class ModalAgendarPageModule {}
