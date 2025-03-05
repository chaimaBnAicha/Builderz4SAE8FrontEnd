import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  // Récupérer les informations du client avec l'ID statique (1)
  getUserInfo(): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/users/1`);
  }

  // Créer une demande de projet
  postRequest(request: any): Observable<any> {
    return this.http.post(`${BASIC_URL}/api/RequestsPost`, request);
  }

  // Récupérer toutes les demandes
  getAllRequest(): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/AllRequest`);
  }

  // Récupérer une demande par son ID
  getAllRequestById(id_projet: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}/api/request/${id_projet}`);
  }

  // Mettre à jour une demande
  updateRequest(id_projet: number, request: any): Observable<any> {
    return this.http.put(`${BASIC_URL}/api/request/${id_projet}`, request);
  }

  // Supprimer une demande
  deleteRequest(id_projet: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}/api/request/${id_projet}`);
  }
  // Récupérer les demandes filtrées par statut
getRequestsByStatus(status: string): Observable<any> {
  return this.http.get(`${BASIC_URL}/api/requests/status?status=${status}`);
}

// Mettre à jour le statut d'une demande (Approver/Rejeter)
updateRequestStatus(id_projet: number, status: string): Observable<any> {
  return this.http.put(`${BASIC_URL}/api/request/${id_projet}/status`, { status });
}
getRequestDetails(id_projet: number): Observable<any> {
  return this.http.get<any>(`${BASIC_URL}/api/request/${id_projet}`);
}
 // Approuver une demande
 approveRequest(id_projet: number): Observable<any> {
  return this.http.put(`${BASIC_URL}/api/request/${id_projet}/approve`, {});
}

// Rejeter une demande
rejectRequest(id_projet: number): Observable<any> {
  return this.http.put(`${BASIC_URL}/api/request/${id_projet}/reject`, {});
}

}