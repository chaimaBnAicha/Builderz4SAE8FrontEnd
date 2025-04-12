import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Leave } from '../models/leave.model';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LeaveType, LeaveStatus } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:8081/leave';  
  private documentApiUrl = 'http://localhost:8081/api/documents';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/retrieve-all-leave`);
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-leave/${id}`);
  }

  addLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(`${this.apiUrl}/add-leave`, leave, this.httpOptions);
  }

  updateLeave(leave: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/modify-Leave`, leave, this.httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/retrieve-leave/${id}`);
  }

  downloadDocument(documentPath: string): Observable<Blob> {
    return this.http.get(`${this.documentApiUrl}/${documentPath}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  uploadDocument(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.documentApiUrl}/upload`, formData, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  canAcceptLeave(leave: Leave): Observable<boolean> {
    if (!leave?.id) {
      return of(false);
    }

    const params = new HttpParams()
      .set('userId', '1')
      .set('startDate', new Date(leave.start_date).toISOString())
      .set('endDate', new Date(leave.end_date).toISOString())
      .set('type', leave.type)
      .set('document', leave.documentAttachement || '')
      .set('status', leave.status);

    return this.http.get<boolean>(`${this.apiUrl}/can-accept`, { params })
      .pipe(
        tap(response => console.log('Can accept response for leave', leave.id, ':', response)),
        catchError(error => {
          console.error('Error checking canAccept:', error);
          return of(false);
        })
      );
  }
}