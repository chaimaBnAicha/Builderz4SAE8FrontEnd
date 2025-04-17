import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LeaveService } from 'src/app/Service/leave.service';
import { Leave } from 'src/app/models/leave.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-getleaves',
  templateUrl: './getleaves.component.html',
  styleUrls: ['./getleaves.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GetleavesComponent implements OnInit {
  @ViewChild('leaveHistoryModal', { static: true }) leaveHistoryModal!: ElementRef;
  leaves: Leave[] = [];
  leaveHistory: Leave[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  originalLeaves: Leave[] = [];
  p: number = 1;
  itemsPerPage: number = 5;

  // Properties for leave details modal
  from: string = '';
  to: string = '';
  duration: number = 0;
  type: string = '';
  status: string = '';
  reason: string = '';
  selectedLeave: Leave | null = null;

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  // Helper method to strip HTML tags
  private stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  downloadPDF() {
    try {
      // Check if we have data to generate PDF
      if (!this.leaveHistory || this.leaveHistory.length === 0) {
        console.error('No leave history data available');
        alert('No leave history data available to generate PDF');
        return;
      }

      console.log('Starting PDF download...');
      console.log('Leave History Data:', this.leaveHistory);

      // Create new PDF document
      const doc = new jsPDF();
      
      // Add Builderz header
      doc.setFontSize(24);
      doc.setTextColor(26, 26, 26);
      doc.text('BUILDERZ', 15, 20);
      
      // Add title
      doc.setFontSize(18);
      doc.text('Leave History Report', 15, 35);
      
      // Add generation date
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 45);

      // Add decorative line
      doc.setDrawColor(253, 190, 51); // Builderz yellow color
      doc.setLineWidth(0.5);
      doc.line(15, 47, 195, 47);

      // Prepare data for the table with sanitized reason field
      const tableData = this.leaveHistory.map(leave => [
        new Date(leave.start_date).toLocaleDateString(),
        new Date(leave.end_date).toLocaleDateString(),
        leave.type || '',
        this.stripHtmlTags(leave.reason) || '',
        leave.status || ''
      ]);

      // Define the columns
      const headers = [['Start Date', 'End Date', 'Type', 'Reason', 'Status']];

      console.log('Generating table with data:', tableData);

      // Add the table using autoTable
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 55,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 6,
        },
        headStyles: {
          fillColor: [26, 26, 26],
          textColor: [253, 190, 51],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 25 }
        }
      });

      // Save the PDF
      console.log('Saving PDF...');
      doc.save('leave_history.pdf');
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  }

  loadLeaves() {
    console.log('Loading leaves...');
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        console.log('Received leaves data:', data);
        this.leaves = data;
        this.originalLeaves = [...data];
        // Filter leaves for history (all leaves except pending ones)
        this.leaveHistory = data.filter(leave => leave.status !== 'Pending');
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
      }
    });
  }

  openHistoryModal() {
    // Filter leaves for history (all leaves except pending ones)
    this.leaveHistory = this.leaves.filter(leave => leave.status !== 'Pending');
    // Show the modal
    this.leaveHistoryModal.nativeElement.classList.add('show');
    this.leaveHistoryModal.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  closeHistoryModal() {
    this.leaveHistoryModal.nativeElement.classList.remove('show');
    this.leaveHistoryModal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
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

  // Method to close the modal
  closeModal() {
    // Add logic to close your modal
    // If you're using Bootstrap modal:
    // $('#yourModalId').modal('hide');
    // Or if you're using a custom modal, set a visibility flag
    this.selectedLeave = null;
  }

  // Method to open leave details
  openLeaveDetails(leave: Leave) {
    this.selectedLeave = leave;
    this.from = new Date(leave.start_date).toLocaleDateString();
    this.to = new Date(leave.end_date).toLocaleDateString();
    this.type = leave.type;
    this.status = leave.status;
    this.reason = leave.reason;
    
    // Calculate duration
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    this.duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Add logic to show your modal
    // If you're using Bootstrap modal:
    // $('#yourModalId').modal('show');
  }
}
