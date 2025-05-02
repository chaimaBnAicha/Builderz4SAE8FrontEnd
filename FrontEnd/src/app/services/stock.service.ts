import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Stock as StockModel, StockCategory } from '../BackOffice/stock/stock.model';

export interface Stock {
  id_stock: number;
  name: string;
  quantity: number;
  unitPrice: number;
  description: string;
  category: StockCategory;
  bills?: any[];
}

export interface NewStock {
  name: string;
  quantity: number;
  unitPrice: number;
  description: string;
  category: StockCategory;
  bills?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8081/spring/stock';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur côté client:', error.error.message);
    } else {
      // Erreur côté serveur - afficher le code HTTP et le message
      console.error(
        `Code retour backend: ${error.status}, ` +
        `Corps: ${JSON.stringify(error.error)}`);
    }
    // Retourner un observable avec un message d'erreur
    return throwError(() => new Error('Une erreur est survenue; veuillez réessayer plus tard.'));
  }

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/all`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getStockById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addStock(stock: NewStock): Observable<object> {
    return this.http.post(`${this.apiUrl}/add`, stock, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/update/${id}`, stock, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}