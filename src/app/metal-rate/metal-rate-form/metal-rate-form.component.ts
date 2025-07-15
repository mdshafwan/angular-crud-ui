import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MetalRate } from '../metal-rate.service';
import { MetalService, Metal } from '../../metal/metal.service';
import { PurityService, Purity } from '../../purity/purity.service';

@Component({
  selector: 'app-metal-rate-form',
  templateUrl: './metal-rate-form.component.html',
  styleUrls: ['./metal-rate-form.component.css']
})
export class MetalRateFormComponent implements OnInit {
  @Input() metalRate: MetalRate = {
    id: '',
    metalId: '',
    purityId: '',
    rate: 0,
    effectiveDate: new Date().toISOString().split('T')[0]
  };
  
  @Output() formSubmit = new EventEmitter<MetalRate>();
  @Output() cancel = new EventEmitter<void>();

  metals: Metal[] = [];
  purities: Purity[] = [];
  loadingMetals = true;
  loadingPurities = true;

  constructor(
    private metalService: MetalService,
    private purityService: PurityService
  ) {}

  ngOnInit(): void {
    this.loadMetals();
    this.loadPurities();
  }

  loadMetals(): void {
    this.loadingMetals = true;
    this.metalService.getAllMetals().subscribe({
      next: (metals: Metal[]) => {
        this.metals = metals;
        this.loadingMetals = false;
      },
      error: (err) => {
        console.error('Error loading metals:', err);
        this.loadingMetals = false;
      }
    });
  }

  loadPurities(): void {
    this.loadingPurities = true;
    this.purityService.getAllpurity().subscribe({
      next: (purities: Purity[]) => {
        this.purities = purities;
        this.loadingPurities = false;
      },
      error: (err) => {
        console.error('Error loading purities:', err);
        this.loadingPurities = false;
      }
    });
  }

  onSubmit(): void {
    this.formSubmit.emit(this.metalRate);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}