import { Component, OnInit } from '@angular/core';
import { MetalRateService, MetalRate } from '../../metal-rate/metal-rate.service';
import { MetalService, Metal } from '../../metal/metal.service';
import { PurityService, Purity } from '../../purity/purity.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-metal-rate',
  templateUrl: './metal-rate-list.component.html',
  styleUrls: ['./metal-rate-list.component.css'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-8px)' }),
          stagger('60ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MetalRateComponent implements OnInit {
  metalRates: MetalRate[] = [];

  metalMap: Map<string, Metal> = new Map();
  purityMap: Map<string, Purity> = new Map();

  showFormFlag = false;
  selectedMetalRate: MetalRate = {
    metalId: '',
    purityId: '',
    rate: 0,
    effectiveDate: ''
  };

  page = 1;
  itemsPerPage = 5;

  sortField: keyof MetalRate = 'effectiveDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterText = '';
  fromDate?: string;
  toDate?: string;

  constructor(
    private metalRateService: MetalRateService,
    private metalService: MetalService,
    private purityService: PurityService
  ) {}

  ngOnInit(): void {
    this.loadMetadataAndRates();
  }

  private loadMetadataAndRates(): void {
    this.metalService.getAllMetals().subscribe({
      next: metals => {
        metals.forEach(m => m.id && this.metalMap.set(m.id, m));
        this.purityService.getAllpurity().subscribe({
          next: purities => {
            purities.forEach(p => p.id && this.purityMap.set(p.id, p));
            this.loadRates(); // initial load
          },
          error: err => console.error('Failed to load purities:', err)
        });
      },
      error: err => console.error('Failed to load metals:', err)
    });
  }

  private loadRates(): void {
  this.metalRateService.getFilteredMetalRates(this.fromDate, this.toDate).subscribe({
    next: rates => {
      const safeRates = Array.isArray(rates) ? rates : [];
      console.log('Filtered rates:', safeRates);
      this.metalRates = [...safeRates];
      this.page = 1;
      this.sortRates();
    },
    error: err => console.error('Failed to load filtered metal rates:', err)
  });
}
  applyFilters(): void {
    this.loadRates();
  }

  showForm(): void {
    this.selectedMetalRate = {
      metalId: '',
      purityId: '',
      rate: 0,
      effectiveDate: ''
    };
    this.showFormFlag = true;
  }

  hideForm(): void {
    this.showFormFlag = false;
  }

  editMetalRate(rate: MetalRate): void {
    this.selectedMetalRate = { ...rate };
    this.showFormFlag = true;
  }

  deleteMetalRate(id: string): void {
    this.metalRateService.deleteMetalRate(id).subscribe(() => {
      this.loadRates();
    });
  }

  handleFormSubmit(rate: MetalRate): void {
    const request = rate.id
      ? this.metalRateService.updateMetalRate(rate.id, rate)
      : this.metalRateService.createMetalRate(rate);

    request.subscribe(() => {
      this.loadRates();
      this.hideForm();
    });
  }

  getMetalName(id: string): string {
    return this.metalMap.get(id)?.name || 'Unknown Metal';
  }

  getMetalSymbol(id: string): string {
    return this.metalMap.get(id)?.symbol || '–';
  }

  getPurityValue(id: string): string {
    return this.purityMap.get(id)?.value?.toFixed(2) || '–';
  }

  toggleSort(field: keyof MetalRate): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortRates();
  }

  sortRates(): void {
    if (!this.metalRates || this.metalRates.length < 2) return;

    this.metalRates.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];

      const strA = typeof valA === 'string' ? valA.toLowerCase() : String(valA);
      const strB = typeof valB === 'string' ? valB.toLowerCase() : String(valB);

      return this.sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }

      get filteredRates(): MetalRate[] {
      if (!this.metalMap.size || !this.purityMap.size) return [];

      const search = this.filterText?.toLowerCase().trim();
      if (!search) return [...(this.metalRates ?? [])];

      return (this.metalRates ?? []).filter(rate => {
        const metal = this.getMetalName(rate.metalId)?.toLowerCase() ?? '';
        const purity = this.getPurityValue(rate.purityId)?.toLowerCase() ?? '';
        const date = rate.effectiveDate?.toLowerCase() ?? '';

        return metal.includes(search) || purity.includes(search) || date.includes(search);
      });
    }

  onPageChange(pageNum: number): void {
    this.page = pageNum;
  }
}