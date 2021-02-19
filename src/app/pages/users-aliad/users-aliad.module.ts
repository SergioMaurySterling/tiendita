import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersAliadPageRoutingModule } from './users-aliad-routing.module';

import { UsersAliadPage } from './users-aliad.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersAliadPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [UsersAliadPage]
})
export class UsersAliadPageModule {}
