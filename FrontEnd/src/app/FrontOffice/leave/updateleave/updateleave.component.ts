import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveService } from 'src/app/Service/leave.service';
import { LeaveType, LeaveStatus, Leave } from 'src/app/models/leave.model';

@Component({
  selector: 'app-updateleave',
  templateUrl: './updateleave.component.html',
  styleUrls: ['./updateleave.component.css']
})
export class UpdateleaveComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveId!: number;
  leaveTypes = Object.values(LeaveType);
  minDate: string;
  currentDocument: string = '';

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.leaveId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadLeave();
  }

  initForm() {
    this.leaveForm = this.fb.group({
      id: [this.leaveId],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      documentAttachement: [''],
      status: [LeaveStatus.PENDING]
    });
  }

  loadLeave() {
    this.leaveService.getLeaveById(this.leaveId).subscribe({
      next: (leave) => {
        this.leaveForm.patchValue({
          start_date: new Date(leave.start_date).toISOString().split('T')[0],
          end_date: new Date(leave.end_date).toISOString().split('T')[0],
          type: leave.type,
          reason: leave.reason,
          status: leave.status
        });
        this.currentDocument = leave.documentAttachement;
      },
      error: (error) => {
        console.error('Error loading leave:', error);
      }
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.leaveForm.patchValue({
        documentAttachement: file.name
      });
      this.leaveForm.markAsDirty();
    }
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      const formValue = this.leaveForm.value;
      const leave: Leave = {
        id: Number(this.leaveId),
        start_date: formValue.start_date,
        end_date: formValue.end_date,
        type: formValue.type,
        reason: formValue.reason,
        documentAttachement: formValue.documentAttachement || null,
        status: formValue.status || LeaveStatus.PENDING
      };

      console.log('Submitting leave:', leave);
      
      this.leaveService.updateLeave(leave).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.router.navigate(['/leave']);
        },
        error: (error) => {
          console.error('Error details:', error);
          if (error.error) {
            console.error('Server error message:', error.error);
          }
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/leaves']);
  }

  get f() {
    return this.leaveForm.controls;
  }
}
