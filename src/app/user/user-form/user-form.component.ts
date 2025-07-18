import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Input() user: User = { name: '', email: '' };
  @Output() formSubmit = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit(this.user);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}