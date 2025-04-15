import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of as rxjsOf } from 'rxjs';
const BASIC_URL = 'http://localhost:8081';  // Assurez-vous que l'URL correspond à celle de votre backend

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(private http: HttpClient) { }

  // Analyser la description du projet (envoie la description à l'API backend)
  analyzeDescription(description: string): Observable<any> {
    return this.http.post(`${BASIC_URL}/api/analyze-description`, { description }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'analyse de la description', error);
        return of({ analysis: 'L\'analyse a échoué.' }); // Retourner une valeur par défaut en cas d'erreur
      })
    );
  }
}
function of(arg0: { analysis: string; }): any {
  return rxjsOf(arg0);
}

