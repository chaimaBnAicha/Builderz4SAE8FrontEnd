import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      Typeoffer: [TypeOffer.Insurance],
      Status: [OfferStatus.ACTIVE],
      user_id: [1]
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
}
