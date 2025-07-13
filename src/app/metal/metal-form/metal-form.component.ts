import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Metal } from '../metal.service';

@Component({
  selector: 'app-metal-form',
  templateUrl: './metal-form.component.html',
  styleUrls: ['./metal-form.component.css']
})
export class MetalFormComponent {
  @Input() metal: Metal = {  name: '', symbol: '' };
  @Output() formSubmit = new EventEmitter<Metal>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit(this.metal);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}