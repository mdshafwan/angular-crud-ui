import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetalListComponent } from './metal-list/metal-list.component';
import { MetalFormComponent } from './metal-form/metal-form.component';

@NgModule({
  declarations: [
    MetalListComponent,
    MetalFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MetalListComponent
  ]
})
export class MetalModule { }