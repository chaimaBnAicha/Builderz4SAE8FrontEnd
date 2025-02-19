import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../Models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferServiceService {
  private apiUrl = 'http://localhost:8081/BackendZagrouba/offer';

  constructor(private http: HttpClient) { }

  // Create - Add a new offer
  createOffer(offer: Offer): Observable<Offer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Convert dates to proper format for Java backend
    const formattedOffer = {
      ...offer,
      Start_Date: new Date(offer.Start_Date).toISOString(),
      End_Date: new Date(offer.End_Date).toISOString()
    };

    console.log('Service sending offer:', JSON.stringify(formattedOffer, null, 2));
    
    return this.http.post<Offer>(`${this.apiUrl}/add-Offer`, formattedOffer, { headers });
  }

  // Read - Get all offers
  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/retrieve-all-Offers`);
  }

  // Read - Get offer by ID
  getOfferById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/retrieve-Offer/${id}`);
  }

  // Update - Update an existing offer
  updateOffer(id: number, offer: Offer): Observable<Offer> {
    const formattedOffer = {
      ...offer,
      id_offer: id,
      Start_Date: new Date(offer.Start_Date).toISOString(),
      End_Date: new Date(offer.End_Date).toISOString()
    };
    return this.http.put<Offer>(`${this.apiUrl}/modify-Offer`, formattedOffer);
  }

  // Delete - Delete an offer
  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-Offer/${id}`);
  }
}
