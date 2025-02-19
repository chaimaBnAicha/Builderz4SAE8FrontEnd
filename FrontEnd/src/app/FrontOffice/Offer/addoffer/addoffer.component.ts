import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferServiceService } from '../../Services/offer-service.service';
import { Router } from '@angular/router';
import { TypeOffer, Offer } from '../../Models/offer.model';

@Component({
  selector: 'app-addoffer',
  templateUrl: './addoffer.component.html',
  styleUrls: ['./addoffer.component.css']
})
export class AddofferComponent implements OnInit {
  offerForm: FormGroup;
  submitted = false;
  TypeOffer = TypeOffer;

  constructor(
    private formBuilder: FormBuilder,
    private offerService: OfferServiceService,
    private router: Router
  ) {
    this.offerForm = this.formBuilder.group({
      Title: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Start_Date: ['', [Validators.required]],
      End_Date: ['', [Validators.required]],
      Typeoffer: [TypeOffer.ACTIVE]
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
      console.log('Form validation errors:', this.offerForm.errors);
      Object.keys(this.offerForm.controls).forEach(key => {
        const controlErrors = this.offerForm.get(key)?.errors;
        if (controlErrors) {
          console.log('Control:', key, 'Errors:', controlErrors);
        }
      });
      return;
    }

    // Format the dates to match backend expectations
    const formValue: Offer = {
      Title: this.offerForm.value.Title,
      Description: this.offerForm.value.Description,
      Start_Date: this.offerForm.value.Start_Date, // Let service handle date formatting
      End_Date: this.offerForm.value.End_Date,     // Let service handle date formatting
      Typeoffer: this.offerForm.value.Typeoffer
    };

    console.log('Form value before submission:', formValue);

    this.offerService.createOffer(formValue).subscribe({
      next: (response) => {
        console.log('Offer created successfully', response);
        this.router.navigate(['/getoffer']);
      },
      error: (error) => {
        console.error('Error creating offer:', error);
        console.error('Error details:', error.error);
        // Add user feedback here
        alert('Error creating offer. Please try again.');
      }
    });
  }

  // Reset form
  onReset() {
    this.submitted = false;
    this.offerForm.reset();
    this.offerForm.patchValue({
      Typeoffer: TypeOffer.ACTIVE
    });
  }
}
