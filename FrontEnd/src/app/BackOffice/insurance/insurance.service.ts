import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Insurance } from './insurance.interface';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  // Using direct backend URL for testing
  private apiUrl = 'http://localhost:8081/Insurance';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}\nError Details: ${JSON.stringify(error.error)}`;
    }
    console.error('Full error details:', error);
    return throwError(() => errorMessage);
  }

  getAllInsurances(): Observable<Insurance[]> {
    const url = `${this.apiUrl}/retrieve-all-Insurances`;
    console.log('Fetching all insurances from:', url);
    return this.http.get<Insurance[]>(url, this.httpOptions)
      .pipe(
        tap(data => {
          console.log('Received data:', data);
          // Add user ID to each insurance record
          return data.map(insurance => ({
            ...insurance,
            user: { id: 1 }
          }));
        }),
        catchError(this.handleError)
      );
  }

  getInsuranceById(id: number): Observable<Insurance> {
    const url = `${this.apiUrl}/retrieve-Insurance/${id}`;
    return this.http.get<Insurance>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createInsurance(insurance: Insurance): Observable<Insurance> {
    // Format the data to match backend expectations
    const formattedInsurance = {
      description: insurance.description,
      start_Date: insurance.start_Date,
      end_Date: insurance.end_Date,
      amount: insurance.amount,
      category: insurance.category,
      user: { id: 1 } // Set default user ID to 1
    };

    const url = `${this.apiUrl}/add-Insurance`;
    console.log('Creating insurance with formatted data:', formattedInsurance);
    console.log('Full request details:', {
      url: url,
      method: 'POST',
      headers: this.httpOptions.headers,
      body: formattedInsurance
    });

    return this.http.post<Insurance>(url, formattedInsurance, this.httpOptions)
      .pipe(
        tap(response => console.log('Create insurance response:', response)),
        catchError(error => {
          console.error('Error in createInsurance:', error);
          return this.handleError(error);
        })
      );
  }

  updateInsurance(id: number, insurance: Insurance): Observable<Insurance> {
    const formattedInsurance = {
      id_Insurance: id,
      description: insurance.description,
      start_Date: insurance.start_Date,
      end_Date: insurance.end_Date,
      amount: insurance.amount,
      category: insurance.category,
      user: { id: 1 } // Set default user ID to 1
    };

    const url = `${this.apiUrl}/modify-Insurance`;
    console.log('Updating insurance with formatted data:', formattedInsurance);
    return this.http.put<Insurance>(url, formattedInsurance, this.httpOptions)
      .pipe(
        tap(response => console.log('Update insurance response:', response)),
        catchError(error => {
          console.error('Error in updateInsurance:', error);
          return this.handleError(error);
        })
      );
  }

  deleteInsurance(id: number): Observable<void> {
    const url = `${this.apiUrl}/remove-Insurance/${id}`;
    return this.http.delete<void>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
} 