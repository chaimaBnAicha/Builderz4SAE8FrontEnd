import { Component, OnInit } from '@angular/core';
import { AdvanceService } from 'src/app/Service/advance.service';

@Component({
  selector: 'app-advance-back',
  templateUrl: './advance-back.component.html',
  styleUrls: ['./advance-back.component.css']
})
export class AdvanceBackComponent implements OnInit {
  advances: any[] = [];
  approvalStatus: { [key: number]: boolean } = {};  // Store approval status for each advance

  constructor(private advanceService: AdvanceService) {}

  ngOnInit() {
    this.loadAdvances();
  }

  loadAdvances() {
    this.advanceService.getAdvances().subscribe({
      next: (data) => {
        console.log('Loaded advances:', data);
        this.advances = data;
        // Check approval status for each advance
        this.advances.forEach(advance => {
          this.checkApprovalStatus(advance.id);
        });
      },
      error: (error) => {
        console.error('Error fetching advances:', error);
      }
    });
  }

  checkApprovalStatus(advanceId: number) {
    this.advanceService.canApproveAdvance(1, advanceId).subscribe({
      next: (canApprove) => {
        this.approvalStatus[advanceId] = canApprove;
      },
      error: (error) => {
        console.error('Error checking approval status:', error);
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
          console.error('Error details:', error.error);
          alert('Failed to reject advance. Please try again.');
        }
      });
    }
  }
}
