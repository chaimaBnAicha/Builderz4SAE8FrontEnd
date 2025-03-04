import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { OfferServiceService } from '../../Services/offer-service.service';
import { Router } from '@angular/router';
import { TypeOffer, Offer, OfferStatus } from '../../Models/offer.model';

@Component({
  selector: 'app-addoffer',
  templateUrl: './addoffer.component.html',
  styleUrls: ['./addoffer.component.css']
})
export class AddofferComponent implements OnInit {
  offerForm: FormGroup;
  submitted = false;
  TypeOffer = TypeOffer;
  OfferStatus = OfferStatus;
  today: string;
  successMessage: string = '';
  errorMessage: string = '';

  editorConfig = {
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
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.setContent('');
      });
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private offerService: OfferServiceService,
    private router: Router
  ) {
    this.today = new Date().toISOString().split('T')[0];
    
    this.offerForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Start_Date: [this.today, [Validators.required]],
      End_Date: ['', [Validators.required]],
      Typeoffer: [TypeOffer.Insurance],
      Status: [OfferStatus.ACTIVE]
    }, {
      validators: this.dateValidator
    });
  }

  ngOnInit(): void {
  }

  // Getter for easy access to form fields
  get f() { 
    return this.offerForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.offerForm.invalid) {
      return;
    }

    const formData = this.offerForm.value;
    
    this.offerService.createOffer(formData).subscribe({
      next: (response) => {
        console.log('Offer created successfully:', response);
        this.successMessage = 'Offer created successfully! Email notification has been sent.';
        setTimeout(() => {
          this.router.navigate(['/admin/getoffer']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating offer:', error);
        this.errorMessage = 'Failed to create offer. Please try again.';
      }
    });
  }

  // Reset form
  onReset() {
    this.submitted = false;
    this.offerForm.reset({
      Typeoffer: TypeOffer.Insurance,
      Status: OfferStatus.ACTIVE
    });
  }

  onCancel() {
    this.router.navigate(['/admin/getoffer']);
  }

  // Add date validator
  dateValidator(group: FormGroup): ValidationErrors | null {
    const start = group.get('Start_Date')?.value;
    const end = group.get('End_Date')?.value;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (endDate <= startDate) {
        return { dateError: 'End date must be after start date' };
      }
    }
    return null;
  }

  // Add this method to handle end date min value
  onStartDateChange() {
    const startDateInput = this.offerForm.get('Start_Date')?.value;
    if (startDateInput) {
      const endDateInput = document.getElementById('End_Date') as HTMLInputElement;
      if (endDateInput) {
        endDateInput.min = startDateInput;
      }
    }
  }

  // Add this method to safely get the date error message
  getDateErrorMessage(): string {
    return this.offerForm.errors?.['dateError'] || '';
  }
}
