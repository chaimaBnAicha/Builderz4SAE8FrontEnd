import { Component, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/Service/leave.service';
import { Leave } from 'src/app/models/leave.model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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

  private apiUrl = 'http://localhost:8081/api/documents'; 

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private http: HttpClient
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
        alert('Error loading leaves. Please try again later.');
      }
    });
  }

  onSearch() {
    this.leaves = [...this.originalLeaves]; // Reset to original data
    
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      this.leaves = this.leaves.filter(leave => 
        leave.reason.toLowerCase().includes(searchLower) ||
        leave.type.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter after search if it exists
    if (this.statusFilter) {
      this.leaves = this.leaves.filter(leave => 
        leave.status === this.statusFilter
      );
    }
  }

  onStatusFilter() {
    this.leaves = [...this.originalLeaves]; // Reset to original data
    
    if (this.statusFilter) {
      this.leaves = this.leaves.filter(leave => 
        leave.status === this.statusFilter
      );
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  onItemsPerPageChange() {
    this.p = 1;
  }

  onDelete(leaveId: number | undefined) {
    if (leaveId) {
      if (confirm('Are you sure you want to delete this leave request?')) {
        this.leaveService.deleteLeave(leaveId).subscribe({
          next: () => {
            this.loadLeaves(); // Refresh the list after deletion
          },
          error: (error) => {
            console.error('Error deleting leave:', error);
          }
        });
      }
    }
  }

  downloadDocument(leave: Leave) {
    if (!leave.documentAttachement) return;
    
    leave.isDownloading = true;
    leave.downloadError = false;

    this.leaveService.downloadDocument(leave.documentAttachement)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = leave.documentAttachement || 'document';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          leave.isDownloading = false;
        },
        error: (error) => {
          console.error('Error downloading document:', error);
          leave.downloadError = true;
          leave.isDownloading = false;
        }
      });
  }
}
