import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MymodalsPageRoutingModule } from './mymodals-routing.module';

import { MymodalsPage } from './mymodals.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MymodalsPageRoutingModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [MymodalsPage]
})
export class MymodalsPageModule {}
