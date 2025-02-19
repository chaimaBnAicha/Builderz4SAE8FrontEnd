import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferServiceService } from '../../Services/offer-service.service';
import { TypeOffer } from '../../Models/offer.model';

@Component({
  selector: 'app-updateoffer',
  templateUrl: './updateoffer.component.html',
  styleUrls: ['./updateoffer.component.css']
})
export class UpdateofferComponent implements OnInit {
  offerForm: FormGroup;
  offerId: number = 0;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferServiceService
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
    // Get the offer ID from the route parameters
    this.route.params.subscribe(params => {
      this.offerId = +params['id']; // Convert string to number using +
      this.loadOfferData();
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.offerForm.controls;
  }

  loadOfferData() {
    this.offerService.getOfferById(this.offerId).subscribe({
      next: (offer) => {
        // Format dates to YYYY-MM-DD for input type="date"
        const startDate = new Date(offer.Start_Date).toISOString().split('T')[0];
        const endDate = new Date(offer.End_Date).toISOString().split('T')[0];
        
        this.offerForm.patchValue({
          Title: offer.Title,
          Description: offer.Description,
          Start_Date: startDate,
          End_Date: endDate,
          Typeoffer: offer.Typeoffer
        });
      },
      error: (error) => {
        console.error('Error loading offer:', error);
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.offerForm.invalid) {
      return;
    }

    // Format the dates to match backend expectations
    const formValue = {
      ...this.offerForm.value,
      Start_Date: new Date(this.offerForm.value.Start_Date).toISOString(),
      End_Date: new Date(this.offerForm.value.End_Date).toISOString()
    };

    this.offerService.updateOffer(this.offerId, formValue).subscribe({
      next: (response) => {
        console.log('Offer updated successfully', response);
        this.router.navigate(['/getoffer']);
      },
      error: (error) => {
        console.error('Error updating offer:', error);
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.loadOfferData(); // Reload the original data
  }

  onCancel() {
    this.router.navigate(['/getoffer']);
  }
}
