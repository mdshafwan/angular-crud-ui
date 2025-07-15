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

  showFormFlag: boolean = false;
  selectedMetalRate: MetalRate = {
    metalId: '',
    purityId: '',
    rate: 0,
    effectiveDate: ''
  };

  // 🔄 Pagination
  page: number = 1;
  itemsPerPage: number = 5;

  // 🔤 Sorting
  sortField: keyof MetalRate = 'effectiveDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  // 🔍 Filtering
  filterText: string = '';

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
            this.loadRates();
          },
          error: err => console.error('Failed to load purities:', err)
        });
      },
      error: err => console.error('Failed to load metals:', err)
    });
  }

  private loadRates(): void {
    this.metalRateService.getAllMetalRates().subscribe({
      next: rates => {
        this.metalRates = rates;
        this.sortRates();
      },
      error: err => console.error('Failed to load metal rates:', err)
    });
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
      this.metalRates = this.metalRates.filter(r => r.id !== id);
    });
  }

  handleFormSubmit(rate: MetalRate): void {
    const request = rate.id
      ? this.metalRateService.updateMetalRate(rate.id, rate)
      : this.metalRateService.createMetalRate(rate);

    request.subscribe(result => {
      if (rate.id) {
        const index = this.metalRates.findIndex(r => r.id === result.id);
        if (index !== -1) this.metalRates[index] = result;
      } else {
        this.metalRates.push(result);
      }
      this.sortRates();
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
    return this.purityMap.get(id)?.value.toFixed(2) || '–';
  }

  // ✅ Sorting
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

  // ✅ Filtering
  get filteredRates(): MetalRate[] {
    return this.metalRates.filter(rate => {
      const metal = this.getMetalName(rate.metalId).toLowerCase();
      const purity = this.getPurityValue(rate.purityId).toLowerCase();
      const date = rate.effectiveDate.toLowerCase();

      return metal.includes(this.filterText.toLowerCase()) ||
             purity.includes(this.filterText.toLowerCase()) ||
             date.includes(this.filterText.toLowerCase());
    });
  }

  // ✅ Pagination handler
  onPageChange(pageNum: number): void {
    this.page = pageNum;
  }
}