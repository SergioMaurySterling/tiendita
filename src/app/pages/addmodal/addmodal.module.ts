import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddmodalPageRoutingModule } from './addmodal-routing.module';

import { AddmodalPage } from './addmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddmodalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddmodalPage]
})
export class AddmodalPageModule {}
