import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from 'src/app/Service/leave.service';
import { LeaveType, LeaveStatus } from 'src/app/models/leave.model';

@Component({
  selector: 'app-addleave',
  templateUrl: './addleave.component.html',
  styleUrls: ['./addleave.component.css']
})
export class AddleaveComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveTypes = Object.values(LeaveType);
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.leaveForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      documentAttachement: [''],
      status: [LeaveStatus.PENDING]
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically upload the file to your server
      // and get back a URL or file path
      this.leaveForm.patchValue({
        documentAttachement: file.name // For now, just storing the filename
      });
    }
  }

  onSubmit() {
    if (this.leaveForm.valid) {
      this.leaveService.addLeave(this.leaveForm.value).subscribe({
        next: () => {
          this.router.navigate(['/leaves']);
        },
        error: (error) => {
          console.error('Error adding leave:', error);
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
