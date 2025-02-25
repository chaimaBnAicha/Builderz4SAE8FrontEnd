import { Component, OnInit } from '@angular/core';
import { OfferServiceService } from '../../Services/offer-service.service';
import { Router } from '@angular/router';
import { Offer, TypeOffer, OfferStatus } from '../../Models/offer.model';

@Component({
  selector: 'app-getoffer',
  templateUrl: './getoffer.component.html',
  styleUrls: ['./getoffer.component.css']
})
export class GetofferComponent implements OnInit {
  offers: Offer[] = [];
  filteredOffers: Offer[] = [];
  searchTerm: string = '';
  TypeOffer = TypeOffer;
  OfferStatus = OfferStatus;
  isLoading = false;
  error: string | null = null;
  
  constructor(
    private offerService: OfferServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.isLoading = true;
    this.error = null;
    
    this.offerService.getAllOffers().subscribe({
      next: (data) => {
        console.log('Component received data:', {
          length: data.length,
          firstItem: data[0],
          allData: data
        });
        this.offers = data;
        this.filteredOffers = data; // Initialize filtered offers
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
        this.isLoading = false;
        this.error = error.message || 'An error occurred while loading offers.';
      }
    });
  }

  // Add search method
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredOffers = this.offers.filter(offer => 
      offer.Title.toLowerCase().includes(searchTerm) ||
      offer.Description.toLowerCase().includes(searchTerm) ||
      offer.Typeoffer.toLowerCase().includes(searchTerm)
    );
  }

  // Navigate to edit page
  editOffer(id: number | undefined) {
    if (id) {
      this.router.navigate(['/admin/updateoffer', id]);
    } else {
      console.error('Cannot edit offer: ID is undefined');
    }
  }

  // Delete offer
  deleteOffer(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this offer?')) {
      this.offerService.deleteOffer(id).subscribe({
        next: () => {
          console.log('Offer deleted successfully');
          this.loadOffers(); // Reload the offers after deletion
        },
        error: (error) => {
          console.error('Error deleting offer:', error);
        }
      });
    }
  }

  // Add this method
  navigateToAddOffer() {
    this.router.navigate(['/admin/addoffer']);
  }
}
