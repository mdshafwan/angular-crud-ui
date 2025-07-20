import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface Metal {
  id?: string;
  name: string;
  symbol: string;
  createdAt?: string; // 📆 Used for date filtering
}

@Injectable({
  providedIn: 'root'
})
export class MetalService {
  private endpoint = 'metals';

  constructor(private api: ApiService) {}

  // 🔹 Get all metals
  getAllMetals(): Observable<Metal[]> {
    return this.api.get<Metal[]>(this.endpoint);
  }

  // 🔹 Create a metal
  createMetal(metal: Metal): Observable<Metal> {
    return this.api.post<Metal>(this.endpoint, metal);
  }

  // 🔹 Update a metal
  updateMetal(id: string, metal: Metal): Observable<Metal> {
    return this.api.put<Metal>(this.endpoint, id, metal);
  }

  // 🔹 Delete a metal
  deleteMetal(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }

  // 📆 Filter metals by createdAt
  getFilteredMetals(fromDate?: string, toDate?: string): Observable<Metal[]> {
    let query: any = {};
    if (fromDate) query.from = fromDate;
    if (toDate) query.to = toDate;
    return this.api.get<Metal[]>(`${this.endpoint}/filter`, query);
  }
}