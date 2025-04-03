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

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 300,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic forecolor backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  };

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
      end_date: ['', [Validators.required]],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      documentAttachement: [''],
      status: [LeaveStatus.PENDING]
    }, { validator: this.dateValidator });
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

  // Custom validator to check if end date is after start date
  dateValidator(group: FormGroup) {
    const start = group.get('start_date')?.value;
    const end = group.get('end_date')?.value;
    
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (endDate < startDate) {
        group.get('end_date')?.setErrors({ endDateInvalid: true });
        return { endDateInvalid: true };
      }
    }
    return null;
  }

  // Update end date min value when start date changes
  onStartDateChange() {
    const startDate = this.leaveForm.get('start_date')?.value;
    if (startDate) {
      this.leaveForm.get('end_date')?.setValue(''); // Reset end date
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 1);
      const endDateInput = document.getElementById('end_date') as HTMLInputElement;
      if (endDateInput) {
        endDateInput.min = minEndDate.toISOString().split('T')[0];
      }
    }
  }
}
