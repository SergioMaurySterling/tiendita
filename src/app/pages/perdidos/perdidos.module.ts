import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerdidosPageRoutingModule } from './perdidos-routing.module';

import { PerdidosPage } from './perdidos.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerdidosPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [PerdidosPage]
})
export class PerdidosPageModule {}
