import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Purity } from '../purity.service';

@Component({
  selector: 'app-purity-form',
  templateUrl: './purity-form.component.html',
  styleUrls: ['./purity-form.component.css']
})
export class PurityFormComponent {
  @Input() purity: Purity = {  name: '', value: 0 };
  @Output() formSubmit = new EventEmitter<Purity>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit(this.purity);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}