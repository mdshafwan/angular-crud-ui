import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { MetalRateComponent } from './metal-rate-list/metal-rate-list.component';
import { MetalRateFormComponent } from './metal-rate-form/metal-rate-form.component';

@NgModule({
  declarations: [
    MetalRateComponent,
    MetalRateFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    MetalRateComponent,
    MetalRateFormComponent
  ]
})
export class MetalRateModule {}