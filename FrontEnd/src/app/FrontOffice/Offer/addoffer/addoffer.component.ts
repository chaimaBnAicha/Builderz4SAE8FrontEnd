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

    if (this.offerForm.invalid) {
      return;
    }

    const formData = this.offerForm.value;
    
    // Create the offer object with proper typing
    const newOffer: Offer = {
      id_offer: undefined,
      Title: formData.Title,
      Description: formData.Description,
      Start_Date: formData.Start_Date,
      End_Date: formData.End_Date,
      Typeoffer: formData.Typeoffer,
      Status: OfferStatus.ACTIVE,
      user_id: 1
    };

    console.log('Submitting offer:', newOffer);

    this.offerService.createOffer(newOffer).subscribe({
      next: (response) => {
        console.log('Offer created successfully:', response);
        this.router.navigate(['/admin/getoffer']);
      },
      error: (error) => {
        console.error('Full error:', error);
        console.error('Request payload:', newOffer);
        // You might want to show an error message to the user here
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
