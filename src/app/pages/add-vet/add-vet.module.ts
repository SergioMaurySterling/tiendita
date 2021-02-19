import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVetPageRoutingModule } from './add-vet-routing.module';

import { AddVetPage } from './add-vet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVetPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddVetPage]
})
export class AddVetPageModule {}
