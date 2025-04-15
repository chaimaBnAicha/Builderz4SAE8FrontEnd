import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Etape {
  id?: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  tacheId?: number; // Add this line
}
@Injectable({
  providedIn: 'root',
})
export class EtapeService {
  private apiUrl = 'http://localhost:8081/api/etapes';

  constructor(private http: HttpClient) {}

  getAllEtapes(): Observable<Etape[]> {
    return this.http.get<Etape[]>(`${this.apiUrl}/all`);
  }

  getEtapeById(id: number): Observable<Etape> {
    return this.http.get<Etape>(`${this.apiUrl}/${id}`);
  }

 /* getEtapesByTacheId(tacheId: number): Observable<Etape[]> {
    return this.http.get<Etape[]>(`${this.apiUrl}/byTache/${tacheId}`);
  }*/
    getEtapesByTacheId(tacheId: number): Observable<Etape[]> {
      return this.http.get<Etape[]>(`${this.apiUrl}/tache/${tacheId}`);
    }
  ajouterEtape(tacheId: number, etape: Etape): Observable<Etape> {
    const formattedEtape = {
      ...etape,
      dateDebut: new Date(etape.dateDebut).toISOString(),
      dateFin: new Date(etape.dateFin).toISOString()
    };
    return this.http.post<Etape>(`${this.apiUrl}/${tacheId}/ajouter`, formattedEtape);
  }

  modifierEtape(id: number, etape: Etape): Observable<Etape> {
    const formattedEtape = {
      ...etape,
      dateDebut: new Date(etape.dateDebut).toISOString(),
      dateFin: new Date(etape.dateFin).toISOString()
    };
    return this.http.put<Etape>(`${this.apiUrl}/${id}/modifier`, formattedEtape);
  }

  supprimerEtape(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/supprimer`);
  }

 
}