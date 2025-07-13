import { Component, OnInit } from '@angular/core';
import { MetalService, Metal } from '../metal.service';
import { fadeInOut, listStagger } from '../../animations';

@Component({
  selector: 'app-metal-list',
  templateUrl: './metal-list.component.html',
  styleUrls: ['./metal-list.component.css'],
  animations: [fadeInOut, listStagger]
})
export class MetalListComponent implements OnInit {
  metals: Metal[] = [];
  selectedMetal: Metal = this.createEmptyMetal();
  showFormFlag = false;
  loading = true;

  constructor(private metalService: MetalService) {}

  ngOnInit(): void {
    this.loadMetals();
  }

  private createEmptyMetal(): Metal {
    return { name: '', symbol: '' };
  }

  loadMetals(): void {
    this.loading = true;
    this.metalService.getAllMetals().subscribe({
      next: data => {
        this.metals = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  showForm(): void {
    this.selectedMetal = this.createEmptyMetal();
    this.showFormFlag = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  editMetal(metal: Metal): void {
    this.selectedMetal = { ...metal };
    this.showFormFlag = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  deleteMetal(id?: string): void {
  if (!id) return;

  this.metalService.deleteMetal(id).subscribe({
    next: () => {
      this.metals = this.metals.filter(m => m.id !== id);
    },
    error: () => alert('Failed to delete metal')
  });
}

  handleFormSubmit(metal: Metal): void {
    if (metal.id) {
      this.metalService.updateMetal(metal.id, metal).subscribe({
        next: updated => {
          const index = this.metals.findIndex(m => m.id === updated.id);
          if (index > -1) this.metals[index] = updated;
          this.hideForm();
        },
        error: () => alert('Failed to update metal')
      });
    } else {
      this.metalService.createMetal(metal).subscribe({
        next: newMetal => {
          this.metals = [...this.metals, newMetal];
          this.hideForm();
        },
        error: () => alert('Failed to create metal')
      });
    }
  }

  hideForm(): void {
    this.showFormFlag = false;
    this.selectedMetal = this.createEmptyMetal();
  }
}