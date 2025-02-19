import { Component, OnInit } from '@angular/core';
import { OfferServiceService } from '../../Services/offer-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getoffer',
  templateUrl: './getoffer.component.html',
  styleUrls: ['./getoffer.component.css']
})
export class GetofferComponent implements OnInit {
  offers: any[] = [];
  
  constructor(
    private offerService: OfferServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.offerService.getAllOffers().subscribe({
      next: (data) => {
        this.offers = data;
        console.log('Offers loaded:', this.offers);
      },
      error: (error) => {
        console.error('Error loading offers:', error);
      }
    });
  }

  // Navigate to edit page
  editOffer(id: number) {
    this.router.navigate(['/updateoffer', id]);
  }

  // Delete offer
  deleteOffer(id: number) {
    if (confirm('Are you sure you want to delete this offer?')) {
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
}
