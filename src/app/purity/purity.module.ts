import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { PurityListComponent } from './purity-list/purity-list.component';
import { PurityFormComponent } from './purity-form/purity-form.component';

@NgModule({
  declarations: [
    PurityListComponent,
    PurityFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    PurityListComponent,
    PurityFormComponent
  ]
})
export class PurityModule {}