import { Component, OnInit } from '@angular/core';
import { AdvanceService } from 'src/app/Service/advance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {
  advances: any[] = [];

  constructor(private advanceService: AdvanceService, private router: Router) {}

  ngOnInit() {
    this.loadAdvances();
  }

  loadAdvances() {
    this.advanceService.getAdvances().subscribe({
      next: (data) => {
        console.log('Loaded advances:', data); // Debug log
        this.advances = data;
      },
      error: (error) => {
        console.error('Error fetching advances:', error);
      }
    });
  }

  onEdit(advance: any) {
    this.router.navigate(['/update-advance', advance.id]);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this advance?')) {
      this.advanceService.deleteAdvance(id).subscribe({
        next: () => {
          this.loadAdvances(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting advance:', error);
        }
      });
    }
  }
}
