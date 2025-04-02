import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Leave } from '../models/leave.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:8081/BackendSyrine/leave';  

  constructor(private http: HttpClient) { }

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/retrieve-all-leave`).pipe(
      tap(leaves => console.log('Fetched leaves:', leaves)),
      catchError(this.handleError)
    );
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-leave/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(`${this.apiUrl}/add-leave`, leave).pipe(
      catchError(this.handleError)
    );
  }

  updateLeave(leave: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/modify-leave`, leave).pipe(
      catchError(this.handleError)
    );
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/retrieve-leave/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
