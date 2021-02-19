import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCuposPageRoutingModule } from './edit-cupos-routing.module';

import { EditCuposPage } from './edit-cupos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCuposPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditCuposPage]
})
export class EditCuposPageModule {}
