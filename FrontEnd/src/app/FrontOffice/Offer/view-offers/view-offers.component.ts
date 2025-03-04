import { Component, OnInit } from '@angular/core';
import { OfferServiceService } from '../../Services/offer-service.service';
import { Offer, OfferStatus } from '../../Models/offer.model';

@Component({
  selector: 'app-view-offers',
  templateUrl: './view-offers.component.html',
  styleUrls: ['./view-offers.component.css']
})
export class ViewOffersComponent implements OnInit {
  offers: Offer[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedOffer: Offer | null = null;
  showModal: boolean = false;

  constructor(private offerService: OfferServiceService) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.error = null;
    
    this.offerService.getAllOffers().subscribe({
      next: (data) => {
        console.log('Received offers:', data);
        // Filter only active offers
        this.offers = data.filter(offer => offer.Status === OfferStatus.ACTIVE);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching offers:', error);
        this.error = 'Failed to load offers. Please try again later.';
        this.loading = false;
      }
    });
  }

  viewOfferDetails(offerId: number): void {
    this.selectedOffer = this.offers.find(offer => offer.id_offer === offerId) || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedOffer = null;
  }

  isActive(status: OfferStatus): boolean {
    return status === OfferStatus.ACTIVE;
  }
}
