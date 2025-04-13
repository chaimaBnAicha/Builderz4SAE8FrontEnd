import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeaveService } from '../../../Service/leave.service';

type LeaveType = 'Sick Leave' | 'Unpaid Leave' | 'Emergency Leave';

@Component({
  selector: 'app-leave-details-modal',
  templateUrl: './leave-details-modal.component.html',
  styleUrls: ['./leave-details-modal.component.css']
})
export class LeaveDetailsModalComponent implements OnInit {
  @Input() leave: any;

  constructor(
    public activeModal: NgbActiveModal,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    console.log('Leave data:', this.leave); // For debugging
  }

  getDuration(): string {
    if (!this.leave?.start_date || !this.leave?.end_date) return '0 days';
    const start = new Date(this.leave.start_date);
    const end = new Date(this.leave.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  getTypeStyle() {
    const colors: Record<LeaveType, { backgroundColor: string; color: string }> = {
      'Sick Leave': {
        backgroundColor: '#dc3545',
        color: 'white'
      },
      'Unpaid Leave': {
        backgroundColor: '#28a745',
        color: 'white'
      },
      'Emergency Leave': {
        backgroundColor: '#ffc107',
        color: 'black'
      }
    };
    return colors[this.leave?.type as LeaveType] || { backgroundColor: '#3788d8', color: 'white' };
  }

  downloadDocument() {
    if (this.leave?.documentAttachement) {
      this.leaveService.downloadDocument(this.leave.documentAttachement).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.leave.documentAttachement.split('/').pop() || 'document';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (error) => {
          console.error('Error downloading document:', error);
        }
      });
    }
  }
} 