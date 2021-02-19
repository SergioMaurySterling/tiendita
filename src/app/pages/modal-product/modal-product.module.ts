import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProductPageRoutingModule } from './modal-product-routing.module';

import { ModalProductPage } from './modal-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalProductPageRoutingModule
  ],
  declarations: [ModalProductPage]
})
export class ModalProductPageModule {}
