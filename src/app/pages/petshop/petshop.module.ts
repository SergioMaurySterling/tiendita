import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetshopPageRoutingModule } from './petshop-routing.module';

import { PetshopPage } from './petshop.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetshopPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [PetshopPage]
})
export class PetshopPageModule {}
