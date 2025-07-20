import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface MetalRate {
  id?: string;
  metalId: string;
  purityId: string;
  rate: number;
  effectiveDate: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MetalRateService {
  private endpoint = 'metalRates';

  constructor(private api: ApiService) {}

  // 🔹 Fetch all metal rates
  getAllMetalRates(): Observable<MetalRate[]> {
    return this.api.get<MetalRate[]>(this.endpoint);
  }

  // 🔹 Create a new metal rate
  createMetalRate(rate: MetalRate): Observable<MetalRate> {
    return this.api.post<MetalRate>(this.endpoint, rate);
  }

  // 🔹 Update metal rate
  updateMetalRate(id: string, rate: MetalRate): Observable<MetalRate> {
    return this.api.put<MetalRate>(this.endpoint, id, rate);
  }

  // 🔹 Delete metal rate
  deleteMetalRate(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }

  // 📆 Filter metal rates by date range - FIXED IMPLEMENTATION
  getFilteredMetalRates(fromDate?: string, toDate?: string): Observable<MetalRate[]> {
    // Create query parameters object
    const params: any = {};
    
    if (fromDate) {
      params.fromDate = fromDate;
    }
    
    if (toDate) {
      params.toDate = toDate;
    }

    return this.api.get<MetalRate[]>(`${this.endpoint}/filter`, params);
  }
}