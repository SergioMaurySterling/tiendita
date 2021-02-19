import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetModalPageRoutingModule } from './vet-modal-routing.module';

import { VetModalPage } from './vet-modal.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetModalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VetModalPage]
})
export class VetModalPageModule {}
