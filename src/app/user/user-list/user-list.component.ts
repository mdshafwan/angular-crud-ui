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

  page = 1;
  itemsPerPage = 5;
  filterText = '';

  // ✅ Multi-column sort stack
  sortStack: { field: keyof User; direction: 'asc' | 'desc' }[] = [];

  // ✅ Range filter inputs
  minPurity?: number;
  maxPurity?: number;
  fromDate?: string;
  toDate?: string;

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
      error: () => (this.loading = false)
    });
  }

  toggleSort(field: keyof User): void {
    const existing = this.sortStack.find(s => s.field === field);
    if (existing) {
      existing.direction = existing.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortStack.push({ field, direction: 'asc' });
    }
    this.sortUsers();
  }

  getSortIcon(field: keyof User): string {
    const sort = this.sortStack.find(s => s.field === field);
    return sort ? (sort.direction === 'asc' ? '↑' : '↓') : '';
  }

  getSortDirection(field: keyof User): 'asc' | 'desc' | undefined {
    return this.sortStack.find(s => s.field === field)?.direction;
  }

  sortUsers(): void {
    const stack = [...this.sortStack];
    this.users.sort((a, b) => {
      for (const s of stack) {
        const valA = (a[s.field] ?? '').toString().toLowerCase();
        const valB = (b[s.field] ?? '').toString().toLowerCase();
        const cmp = valA.localeCompare(valB);
        if (cmp !== 0) return s.direction === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }

  applyFilters(): void {
    // Empty hook — filtering is driven by `filteredUsers` getter
  }

  get filteredUsers(): User[] {
    return this.users
      .filter(u =>
        (u.name ?? '').toLowerCase().includes(this.filterText.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(this.filterText.toLowerCase())
      )
      .filter(u => {
        const createdAt = u.createdAt ? new Date(u.createdAt).getTime() : 0;
        const from = this.fromDate ? new Date(this.fromDate).getTime() : -Infinity;
        const to = this.toDate ? new Date(this.toDate).getTime() : Infinity;
        const matchesDate = createdAt >= from && createdAt <= to;

        return  matchesDate;
      });
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