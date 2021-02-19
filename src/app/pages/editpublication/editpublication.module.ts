import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpublicationPageRoutingModule } from './editpublication-routing.module';

import { EditpublicationPage } from './editpublication.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpublicationPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditpublicationPage]
})
export class EditpublicationPageModule {}
