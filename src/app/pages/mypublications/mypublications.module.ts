import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MypublicationsPageRoutingModule } from './mypublications-routing.module';

import { MypublicationsPage } from './mypublications.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MypublicationsPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [MypublicationsPage]
})
export class MypublicationsPageModule {}
