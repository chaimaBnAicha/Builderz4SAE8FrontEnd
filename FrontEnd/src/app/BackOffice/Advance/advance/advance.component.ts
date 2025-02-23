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
        console.log('Loaded advances:', data);
        this.advances = data;
      },
      error: (error) => {
        console.error('Error fetching advances:', error);
      }
    });
  }

  onApprove(id: number) {
    if (confirm('Are you sure you want to approve this advance?')) {
      this.advanceService.updateAdvanceStatus(id, 'Approved').subscribe({
        next: () => {
          this.loadAdvances();
        },
        error: (error) => {
          console.error('Error approving advance:', error);
        }
      });
    }
  }

  onReject(id: number) {
    if (confirm('Are you sure you want to reject this advance?')) {
      this.advanceService.updateAdvanceStatus(id, 'Rejected').subscribe({
        next: () => {
          this.loadAdvances();
        },
        error: (error) => {
          console.error('Error rejecting advance:', error);
        }
      });
    }
  }
}
