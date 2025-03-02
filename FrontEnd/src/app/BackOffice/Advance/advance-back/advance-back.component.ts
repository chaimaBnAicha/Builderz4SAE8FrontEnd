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
  originalAdvances: any[] = [];
  searchTerm: string = '';
  statusFilter: string = '';

  constructor(private advanceService: AdvanceService) {}

  ngOnInit() {
    this.loadAdvances();
  }

  loadAdvances() {
    this.advanceService.getAdvances().subscribe({
      next: (data) => {
        console.log('Loaded advances:', data);
        this.advances = data;
        this.originalAdvances = [...data]; // Store original data
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
          // Send notification email
          this.advanceService.notifyUser(id, 'Approved' , "Syrine.zaier@esprit.tn").subscribe({
            next: () => {
              console.log('Notification sent successfully');
            },
            error: (error) => {
              console.error('Error sending notification:', error);
            }
          });
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
          // Send notification email
          this.advanceService.notifyUser(id, 'Rejected', "Syrine.zaier@esprit.tn").subscribe({
            next: () => {
              console.log('Notification sent successfully');
            },
            error: (error) => {
              console.error('Error sending notification:', error);
            }
          });
          this.loadAdvances();
        },
        error: (error) => {
          console.error('Error rejecting advance:', error);
        }
      });
    }
  }

  onSearch() {
    this.filterAdvances();
  }

  onStatusFilter() {
    this.filterAdvances();
  }

  filterAdvances() {
    this.advances = [...this.originalAdvances]; // Start with original data

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      this.advances = this.advances.filter(advance => 
        advance.reason.toLowerCase().includes(searchLower) ||
        advance.amount_request.toString().includes(searchLower)
      );
    }

    if (this.statusFilter) {
      this.advances = this.advances.filter(advance => 
        advance.status === this.statusFilter
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterAdvances();
  }
  p: number = 1;
  itemsPerPage: number = 5;

  // Add this method
  onItemsPerPageChange() {
    this.p = 1; // Reset to first page when items per page changes
  }
}
