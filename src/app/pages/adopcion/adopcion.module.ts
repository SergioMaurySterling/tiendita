import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdopcionPageRoutingModule } from './adopcion-routing.module';

import { AdopcionPage } from './adopcion.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdopcionPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [AdopcionPage]
})
export class AdopcionPageModule {}
