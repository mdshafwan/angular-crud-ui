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
          this.loadRates(); // Only fetch rates after metadata is fully loaded
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
    },
    error: err => {
      console.error('Failed to load metal rates:', err);
    }
  });
}

  getMetalName(id: string): string {
    return this.metalMap.has(id) ? this.metalMap.get(id)!.name : 'Unknown Metal';
  }

  getMetalSymbol(id: string): string {
    return this.metalMap.has(id) ? this.metalMap.get(id)!.symbol : '–';
  }

  getPurityValue(id: string): string {
    const purity = this.purityMap.get(id);
    return purity ? purity.value.toFixed(2) : '–';
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
    if (rate.id) {
      this.metalRateService.updateMetalRate(rate.id, rate).subscribe(updated => {
        const index = this.metalRates.findIndex(r => r.id === updated.id);
        if (index !== -1) this.metalRates[index] = updated;
        this.hideForm();
      });
    } else {
      this.metalRateService.createMetalRate(rate).subscribe(created => {
        this.metalRates.push(created);
        this.hideForm();
      });
    }
  }
}