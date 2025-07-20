import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface Purity {
  id?: string;
  name: string;
  value: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurityService {
  private endpoint = 'purity';

  constructor(private api: ApiService) {}

  getAllpurity(): Observable<Purity[]> {
    return this.api.get<Purity[]>(this.endpoint);
  }

  createPurity(purity: Purity): Observable<Purity> {
    return this.api.post<Purity>(this.endpoint, purity);
  }

  updatePurity(id: string, purity: Purity): Observable<Purity> {
    return this.api.put<Purity>(this.endpoint, id, purity);
  }

  deletePurity(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }

  getFilteredPurities(fromDate?: string, toDate?: string): Observable<Purity[]> {
    const query: any = {};
    if (fromDate) query.from = fromDate;
    if (toDate) query.to = toDate;
    return this.api.get<Purity[]>(`${this.endpoint}/filter`, query);
  }
}