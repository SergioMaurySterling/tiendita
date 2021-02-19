import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterempPageRoutingModule } from './registeremp-routing.module';

import { RegisterempPage } from './registeremp.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterempPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterempPage]
})
export class RegisterempPageModule {}
