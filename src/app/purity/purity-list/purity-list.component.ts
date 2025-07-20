import { Component, OnInit } from '@angular/core';
import { PurityService, Purity } from '../purity.service';
import { fadeInOut, listStagger } from '../../animations';

@Component({
  selector: 'app-purity-list',
  templateUrl: './purity-list.component.html',
  styleUrls: ['./purity-list.component.css'],
  animations: [fadeInOut, listStagger]
})
export class PurityListComponent implements OnInit {
  purities: Purity[] = [];
  showFormFlag = false;
  selectedPurity: Purity = { name: '', value: 0 };

  page: number = 1;
  itemsPerPage: number = 5;

  sortField: keyof Purity = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterText: string = '';
  fromDate?: string;
  toDate?: string;

  constructor(private purityService: PurityService) {}

  ngOnInit(): void {
    this.loadPurities();
  }

  loadPurities(): void {
    this.purityService.getFilteredPurities(this.fromDate, this.toDate).subscribe((purities: Purity[] = []) => {
      this.purities = purities || [];
      this.sortPurity();
    });
  }

  applyFilters(): void {
    this.loadPurities();
  }

  showForm(): void {
    this.selectedPurity = { name: '', value: 0 };
    this.showFormFlag = true;
  }

  editPurity(purity: Purity): void {
    this.selectedPurity = { ...purity };
    this.showFormFlag = true;
  }

  deletePurity(id: string): void {
    if (confirm('Are you sure you want to delete this purity?')) {
      this.purityService.deletePurity(id).subscribe(() => this.loadPurities());
    }
  }

  handleFormSubmit(purity: Purity): void {
    const action = purity.id
      ? this.purityService.updatePurity(purity.id, purity)
      : this.purityService.createPurity(purity);

    action.subscribe(() => {
      this.loadPurities();
      this.hideForm();
    });
  }

  hideForm(): void {
    this.showFormFlag = false;
  }

  toggleSort(field: keyof Purity): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortPurity();
  }

  sortPurity(): void {
    if (!this.purities || this.purities.length < 2) return;

    this.purities.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];

      const strA = typeof valA === 'string' ? valA.toLowerCase() : String(valA);
      const strB = typeof valB === 'string' ? valB.toLowerCase() : String(valB);

      return this.sortDirection === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }

  get filteredPurities(): Purity[] {
    return (this.purities ?? []).filter(p =>
      p.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  onPageChange(pageNum: number): void {
    this.page = pageNum;
  }
}