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
  selectedPurity: Purity = {  name: '', value: 0 };

  constructor(private purityService: PurityService) {}

  ngOnInit(): void {
    this.loadPurities();
  }

  loadPurities(): void {
    this.purityService.getAllpurity().subscribe(
      (purities: Purity[]) => this.purities = purities
    );
  }

  showForm(): void {
    this.selectedPurity = {  name: '', value: 0 };
    this.showFormFlag = true;
  }

  editPurity(purity: Purity): void {
    this.selectedPurity = { ...purity };
    this.showFormFlag = true;
  }

  deletePurity(id: string): void {
  if (confirm('Are you sure you want to delete this purity?')) {
    this.purityService.deletePurity(id).subscribe(
      () => this.loadPurities()
    );
  }
}

  handleFormSubmit(purity: Purity): void {
    if (purity.id) {
      this.purityService.updatePurity(purity.id, purity).subscribe(
        () => {
          this.loadPurities();
          this.hideForm();
        }
      );
    } else {
      this.purityService.createPurity(purity).subscribe(
        () => {
          this.loadPurities();
          this.hideForm();
        }
      );
    }
  }

  hideForm(): void {
    this.showFormFlag = false;
  }
}