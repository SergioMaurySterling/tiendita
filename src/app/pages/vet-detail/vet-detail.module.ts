import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VetDetailPageRoutingModule } from './vet-detail-routing.module';

import { VetDetailPage } from './vet-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VetDetailPageRoutingModule
  ],
  declarations: [VetDetailPage]
})
export class VetDetailPageModule {}
