import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditproductsPageRoutingModule } from './editproducts-routing.module';

import { EditproductsPage } from './editproducts.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditproductsPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditproductsPage]
})
export class EditproductsPageModule {}
