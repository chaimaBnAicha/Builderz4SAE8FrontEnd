import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Pour la création d'un nouveau stock
export interface NewStock extends Omit<Stock, 'id_stock'> {
  id_stock?: number;
}

// Pour un stock existant
export interface Stock {
  id_stock: number;  // Requis pour les stocks existants
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: 'MATERIALS' | 'TOOLS' | 'ELECTRICAL_PLUMBING';
  bills?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8089/pidevBuilderz/spring/stock';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Récupérer tous les stocks
  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/all`);
  }

  // Ajouter un nouveau stock
  addStock(stock: NewStock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/add`, stock, this.httpOptions);
  }

  // Mettre à jour un stock
  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/update/${id}`, stock, this.httpOptions);
  }

  // Supprimer un stock
  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getStockById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }
} 