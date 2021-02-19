import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditmodalPageRoutingModule } from './editmodal-routing.module';

import { EditmodalPage } from './editmodal.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditmodalPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditmodalPage]
})
export class EditmodalPageModule {}
