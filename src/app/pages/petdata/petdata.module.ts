import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetdataPageRoutingModule } from './petdata-routing.module';

import { PetdataPage } from './petdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetdataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PetdataPage]
})
export class PetdataPageModule {}
