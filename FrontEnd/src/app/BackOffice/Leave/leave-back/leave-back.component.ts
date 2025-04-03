import { Component, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/Service/leave.service';
import { Leave, LeaveStatus } from 'src/app/models/leave.model';

@Component({
  selector: 'app-leave-back',
  templateUrl: './leave-back.component.html',
  styleUrls: ['./leave-back.component.css']
})
export class LeaveBackComponent implements OnInit {
  leaves: Leave[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  originalLeaves: Leave[] = [];
  p: number = 1;
  itemsPerPage: number = 5;
  LeaveStatus = LeaveStatus; // Make enum available to template

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        this.leaves = data;
        this.originalLeaves = [...data];
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      }
    });
  }

  onSearch() {
    this.leaves = [...this.originalLeaves];
    
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      this.leaves = this.leaves.filter(leave => 
        leave.reason.toLowerCase().includes(searchLower) ||
        leave.type.toLowerCase().includes(searchLower)
      );
    }

    if (this.statusFilter) {
      this.leaves = this.leaves.filter(leave => 
        leave.status === this.statusFilter
      );
    }
  }

  onStatusFilter() {
    this.onSearch();
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  onItemsPerPageChange() {
    this.p = 1;
  }

  updateStatus(leave: Leave, newStatus: string) {
    const updatedLeave = { 
      ...leave, 
      status: newStatus as LeaveStatus 
    };
    this.leaveService.updateLeave(updatedLeave).subscribe({
      next: () => {
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error updating leave status:', error);
      }
    });
  }
} 