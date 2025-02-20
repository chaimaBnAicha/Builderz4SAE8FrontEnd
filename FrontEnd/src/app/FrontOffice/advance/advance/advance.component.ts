import { Component, OnInit } from '@angular/core';
import { AdvanceService } from 'src/app/Service/advance.service';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {
  advances: any[] = [];

  constructor(private advanceService: AdvanceService) {}

  ngOnInit() {
    this.loadAdvances();
  }

  loadAdvances() {
    this.advanceService.getAdvances().subscribe({
      next: (data) => {
        this.advances = data;
      },
      error: (error) => {
        console.error('Error fetching advances:', error);
      }
    });
  }

  onEdit(advance: any) {
    
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this advance?')) {
      this.advanceService.deleteAdvance(id).subscribe({
        next: () => {
          this.loadAdvances();
        },
        error: (error) => {
          console.error('Error deleting advance:', error);
        }
      });
    }
  }
}
