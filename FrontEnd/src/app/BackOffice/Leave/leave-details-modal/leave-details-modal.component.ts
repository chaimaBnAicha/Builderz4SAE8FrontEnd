import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-leave-details-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Leave Details</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-6">
          <p><strong>Type:</strong> {{ leave.type }}</p>
          <p><strong>Status:</strong> {{ leave.status }}</p>
          <p><strong>Start Date:</strong> {{ leave.start | date:'mediumDate' }}</p>
          <p><strong>End Date:</strong> {{ leave.end | date:'mediumDate' }}</p>
        </div>
        <div class="col-md-6">
          <p><strong>Reason:</strong></p>
          <div [innerHTML]="leave.reason | safeHtml"></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `,
  styles: [`
    .modal-body {
      padding: 20px;
    }
    .modal-body p {
      margin-bottom: 15px;
    }
    .modal-body strong {
      color: #3788d8;
    }
  `]
})
export class LeaveDetailsModalComponent {
  @Input() leave: any;

  constructor(public activeModal: NgbActiveModal) {}
} 