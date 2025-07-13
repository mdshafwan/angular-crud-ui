import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

export interface MetalRate {
  id?: string;
  metalId: string;
  purityId: string;
  rate: number;
  effectiveDate: string;
}

@Injectable({ providedIn: 'root' })
export class MetalRateService {
  private endpoint = 'metalRates';

  constructor(private api: ApiService) {}

  getAllMetalRates(): Observable<MetalRate[]> {
    return this.api.get<MetalRate[]>(this.endpoint);
  }

  createMetalRate(rate: MetalRate): Observable<MetalRate> {
    return this.api.post<MetalRate>(this.endpoint, rate);
  }

  updateMetalRate(id: string, rate: MetalRate): Observable<MetalRate> {
    return this.api.put<MetalRate>(this.endpoint, id, rate);
  }

  deleteMetalRate(id: string): Observable<void> {
    return this.api.delete<void>(this.endpoint, id);
  }
}