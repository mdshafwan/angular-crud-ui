import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../shared/api.service';

export interface Purity {
  id?: string;
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurityService {
   private endpoint = 'purity';
  // private apiUrl = `${environment.apiBaseUrl}/purity`;

  constructor(private api: ApiService) { }

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
    return this.api.delete<void>(this.endpoint, id,);
  }
}