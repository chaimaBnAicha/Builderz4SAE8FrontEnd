import { Component, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/Service/leave.service';
import { Leave } from 'src/app/models/leave.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getleaves',
  templateUrl: './getleaves.component.html',
  styleUrls: ['./getleaves.component.css']
})
export class GetleavesComponent implements OnInit {
  leaves: Leave[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  originalLeaves: Leave[] = [];
  p: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    console.log('Loading leaves...');
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        console.log('Received leaves data:', data);
        this.leaves = data;
        this.originalLeaves = [...data];
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      }
    });
  }

  onSearch() {
    this.filterLeaves();
  }

  onStatusFilter() {
    this.filterLeaves();
  }

  filterLeaves() {
    this.leaves = [...this.originalLeaves];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      this.leaves = this.leaves.filter(leave => 
        leave.reason.toLowerCase().includes(searchLower)
      );
    }

    if (this.statusFilter) {
      this.leaves = this.leaves.filter(leave => 
        leave.status === this.statusFilter
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterLeaves();
  }

  onItemsPerPageChange() {
    this.p = 1;
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          this.loadLeaves(); // Reload the list after deletion
        },
        error: (error) => {
          console.error('Error deleting leave:', error);
        }
      });
    }
  }
}
