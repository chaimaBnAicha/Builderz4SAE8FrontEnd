import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JustificationService {
  private apiUrl = 'http://localhost:8081/api/justifications';

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une justification
  addJustification(requestId: number, justificationText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}`, justificationText, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  

  // Méthode pour récupérer la justification
  getJustification(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`);
  }
}
