import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveService } from 'src/app/Service/leave.service';
import { LeaveType, LeaveStatus } from 'src/app/models/leave.model';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-addleave',
  templateUrl: './addleave.component.html',
  styleUrls: ['./addleave.component.css']
})
export class AddleaveComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveTypes = Object.values(LeaveType);
  minDate: string;
  selectedFile: File | null = null;
  isUploading = false;
  uploadError: string | null = null;

  private apiUrl = 'http://localhost:8081/api/documents';

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
    private router: Router,
    private http: HttpClient
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.leaveForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', [Validators.required]],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      documentAttachement: [''],
      status: [LeaveStatus.PENDING]
    }, { validator: this.dateValidator });
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

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Don't set the form value yet - we'll do that after successful upload
    }
  }

  private uploadDocument(): Promise<string> {
    if (!this.selectedFile) {
      return Promise.resolve(''); // Return empty string if no file selected
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/upload`, formData, {
        responseType: 'text'
      }).subscribe({
        next: (filename: string) => resolve(filename),
        error: (error) => reject(error)
      });
    });
  }

  async onSubmit() {
    if (this.leaveForm.valid) {
      this.isUploading = true;
      this.uploadError = null;

      try {
        // First upload the document if one is selected
        const documentFilename = await this.uploadDocument();
        
        // Create the leave request with the document filename
        const leaveData = {
          ...this.leaveForm.value,
          documentAttachement: documentFilename
        };

        // Submit the leave request
        this.leaveService.addLeave(leaveData).subscribe({
          next: () => {
            this.router.navigate(['/leave']);
          },
          error: (error) => {
            console.error('Error adding leave:', error);
            this.uploadError = 'Failed to create leave request';
          }
        });
      } catch (error) {
        console.error('Error uploading document:', error);
        this.uploadError = 'Failed to upload document';
      } finally {
        this.isUploading = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/leave']);
  }

  get f() {
    return this.leaveForm.controls;
  }
}
