import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurityListComponent } from './purity-list/purity-list.component';
import { PurityFormComponent } from './purity-form/purity-form.component';

@NgModule({
  declarations: [
    PurityListComponent,
    PurityFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PurityListComponent
  ]
})
export class PurityModule { }