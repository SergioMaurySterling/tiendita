import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoupetPageRoutingModule } from './coupet-routing.module';

import { CoupetPage } from './coupet.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoupetPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [CoupetPage]
})
export class CoupetPageModule {}
