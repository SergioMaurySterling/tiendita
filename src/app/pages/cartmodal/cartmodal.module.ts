import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartmodalPageRoutingModule } from './cartmodal-routing.module';

import { CartmodalPage } from './cartmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartmodalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CartmodalPage]
})
export class CartmodalPageModule {}
