import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Leave } from '../models/leave.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LeaveType, LeaveStatus } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:8081/BackendSyrine/leave';  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

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
    const url = `${this.apiUrl}/modify-Leave`;
    
    const formattedLeave = {
      id: Number(leave.id),
      start_date: new Date().toISOString(),  // Current timestamp
      end_date: new Date().toISOString(),    // Current timestamp
      reason: leave.reason || "string",
      documentAttachement: leave.documentAttachement || "string",
      type: LeaveType.SICK,    // Using enum value
      status: LeaveStatus.PENDING  // Using enum value
    };

    console.log('Sending formatted leave:', formattedLeave);
    return this.http.put<Leave>(url, formattedLeave, this.httpOptions).pipe(
      tap(response => console.log('Server response:', response)),
      catchError(error => {
        console.error('Server error:', error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/retrieve-leave/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  downloadDocument(documentPath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${documentPath}`, {
      responseType: 'blob'
    });
  }
}