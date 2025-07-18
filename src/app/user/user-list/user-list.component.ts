import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { fadeInOut, listStagger } from '../../animations';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  animations: [fadeInOut, listStagger]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = this.createEmptyUser();
  showFormFlag = false;
  loading = true;

  page: number = 1;
  itemsPerPage: number = 5;
  filterText: string = '';
  sortField: keyof User = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private createEmptyUser(): User {
    return { name: '', email: '' };
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        this.sortUsers();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  sortUsers(): void {
    this.users.sort((a, b) => {
      const fieldA = a[this.sortField]?.toLowerCase() || '';
      const fieldB = b[this.sortField]?.toLowerCase() || '';
      return this.sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });
  }

  get filteredUsers(): User[] {
    return this.users.filter(u =>
      u.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  toggleSort(field: keyof User): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortUsers();
  }

  showForm(): void {
    this.selectedUser = this.createEmptyUser();
    this.showFormFlag = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.showFormFlag = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  deleteUser(id?: string): void {
    if (!id) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: () => alert('Failed to delete user')
    });
  }

  handleFormSubmit(user: User): void {
    if (user.id) {
      this.userService.updateUser(user.id, user).subscribe({
        next: updated => {
          const index = this.users.findIndex(u => u.id === updated.id);
          if (index > -1) this.users[index] = updated;
          this.sortUsers();
          this.hideForm();
        },
        error: () => alert('Failed to update user')
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: newUser => {
          this.users = [...this.users, newUser];
          this.sortUsers();
          this.hideForm();
        },
        error: () => alert('Failed to create user')
      });
    }
  }

  hideForm(): void {
    this.showFormFlag = false;
    this.selectedUser = this.createEmptyUser();
  }
}