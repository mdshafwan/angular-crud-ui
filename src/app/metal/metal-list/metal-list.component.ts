import { Component, OnInit } from '@angular/core';
import { MetalService, Metal } from '../../metal/metal.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-metal-list',
  templateUrl: './metal-list.component.html',
  styleUrls: ['./metal-list.component.css'],
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
export class MetalListComponent implements OnInit {
  metals: Metal[] = [];
  selectedMetal?: Metal;

  showFormFlag = false;

  page = 1;
  itemsPerPage = 5;

  sortField: keyof Metal = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterText = '';
  fromDate?: string;
  toDate?: string;

  constructor(private metalService: MetalService) {}

  ngOnInit(): void {
    this.loadMetals();
  }

  loadMetals(): void {
    this.metalService.getFilteredMetals(this.fromDate, this.toDate).subscribe({
      next: (metals: Metal[]) => {
        this.metals = metals;
        this.sortMetals();
      },
      error: err => console.error('Failed to load metals:', err)
    });
  }

  applyFilters(): void {
    this.loadMetals();
  }

  showForm(): void {
    this.selectedMetal = {
      name: '',
      symbol: ''
    };
    this.showFormFlag = true;
  }

  hideForm(): void {
    this.showFormFlag = false;
    this.selectedMetal = undefined;
  }

  editMetal(metal: Metal): void {
    this.selectedMetal = { ...metal };
    this.showFormFlag = true;
  }

  deleteMetal(id: string): void {
    this.metalService.deleteMetal(id).subscribe(() => {
      this.metals = this.metals.filter(m => m.id !== id);
    });
  }

  handleFormSubmit(metal: Metal): void {
    const request = metal.id
      ? this.metalService.updateMetal(metal.id, metal)
      : this.metalService.createMetal(metal);

    request.subscribe(result => {
      if (metal.id) {
        const index = this.metals.findIndex(m => m.id === result.id);
        if (index !== -1) this.metals[index] = result;
      } else {
        this.metals.push(result);
      }
      this.sortMetals();
      this.hideForm();
    });
  }

  toggleSort(field: keyof Metal): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortMetals();
  }

  sortMetals(): void {
    this.metals.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      const strA = typeof valA === 'string' ? valA.toLowerCase() : String(valA);
      const strB = typeof valB === 'string' ? valB.toLowerCase() : String(valB);
      return this.sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }

  get filteredMetals(): Metal[] {
    return this.metals.filter(metal => {
      const name = metal.name.toLowerCase();
      const symbol = metal.symbol.toLowerCase();
      const query = this.filterText.toLowerCase();
      return name.includes(query) || symbol.includes(query);
    });
  }

  onPageChange(pageNum: number): void {
    this.page = pageNum;
  }
}