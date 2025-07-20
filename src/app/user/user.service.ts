import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;    // 📆 For date-based filtering
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private endpoint = 'users';

  constructor(private api: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(this.endpoint);
  }

  createUser(user: User): Observable<User> {
    return this.api.post<User>(this.endpoint, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.api.put<User>(this.endpoint, id, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }
  getFilteredUsers(fromDate?: string, toDate?: string): Observable<User[]> {
  let query: any = {};
  if (fromDate) query.from = fromDate;
  if (toDate) query.to = toDate;
  return this.api.get<User[]>(`${this.endpoint}/filter`, query);
}
}