import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface Metal {
  id?: string;
  name: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetalService {
  private endpoint = 'metals';

  constructor(private api: ApiService) {}

  getAllMetals(): Observable<Metal[]> {
    return this.api.get<Metal[]>(this.endpoint);
  }

  createMetal(metal: Metal): Observable<Metal> {
    return this.api.post<Metal>(this.endpoint, metal);
  }

  updateMetal(id: string, metal: Metal): Observable<Metal> {
    return this.api.put<Metal>(this.endpoint, id, metal);
  }

  deleteMetal(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }
}