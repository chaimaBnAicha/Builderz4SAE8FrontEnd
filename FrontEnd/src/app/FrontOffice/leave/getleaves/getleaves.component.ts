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

  private apiUrl = 'http://localhost:8081/BackendSyrine/api/documents'; // Adjust port if needed

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

  downloadDocument(filename: string) {
    // Find the leave to update its loading state
    const leave = this.leaves.find(l => l.documentAttachement === filename);
    if (!leave) return;

    // Add loading state
    leave.isDownloading = true;
    leave.downloadError = false;

    this.http.get(`${this.apiUrl}/${filename}`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      finalize(() => {
        leave.isDownloading = false;
      })
    ).subscribe({
      next: (response) => {
        if (response.body) {
          // Get the filename from the Content-Disposition header if available
          let downloadFilename = filename;
          const contentDisposition = response.headers.get('Content-Disposition');
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
            if (matches != null && matches[1]) {
              downloadFilename = matches[1].replace(/['"]/g, '');
            }
          }

          const blob = new Blob([response.body], { 
            type: response.headers.get('Content-Type') || 'application/octet-stream'
          });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = downloadFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        leave.downloadError = true;
      }
    });
  }
}
