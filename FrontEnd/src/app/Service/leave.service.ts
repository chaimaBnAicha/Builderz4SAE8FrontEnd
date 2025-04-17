import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Leave } from '../models/leave.model';
import { Observable, throwError, of, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LeaveType, LeaveStatus } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:8081/leave';  
  private documentApiUrl = 'http://localhost:8081/api/documents';
  private baseUrl = window.location.origin;  // This will get the current domain
  private logoUrl = "https://i.imgur.com/YX34wNO.png";
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
    // Log the data being sent
    console.log('Updating leave with data:', leave);
    
    const leaveWithUser = {
      ...leave,
      user: { id: 1 }
    };

    // Log the final payload
    console.log('Sending payload:', leaveWithUser);

    return this.http.put<Leave>(`${this.apiUrl}/modify-Leave`, leaveWithUser, this.httpOptions)
      .pipe(
        tap(updatedLeave => {
          console.log('Leave updated successfully:', updatedLeave);
          // Send email notification
          this.sendLeaveStatusEmail(updatedLeave);
        }),
        catchError(error => {
          console.error('Error updating leave:', error);
          return throwError(() => error);
        })
      );
  }

  private sendLeaveStatusEmail(leave: Leave): void {
    const logoUrl = "https://i.imgur.com/YX34wNO.png";

    const emailData = {
      to: 'syrine.zaier@esprit.tn',
      subject: `Leave Request ${leave.status}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
      <img src="${logoUrl}" alt="App Logo" style="max-width: 120px; margin-bottom: 20px; border-radius: 5%; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
          </div>
          <h2 style="color: #333; text-align: center;">Leave Request Update</h2>
          <div style="background-color: ${leave.status === 'Approved' ? '#d4edda' : '#f8d7da'}; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: ${leave.status === 'Approved' ? '#155724' : '#721c24'}; margin: 0;">
              Your leave request has been ${leave.status.toLowerCase()}
            </h3>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h4 style="color: #333; margin-top: 0;">Request Details:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Start Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(leave.start_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>End Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(leave.end_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${leave.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Reason:</strong></td>
                <td style="padding: 8px;">${leave.reason}</td>
              </tr>
            </table>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      isHtml: true
    };

    const url = `${this.apiUrl}/send?to=${encodeURIComponent(emailData.to)}&subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}&isHtml=${emailData.isHtml}`;

    this.http.post(url, null).subscribe({
      next: () => console.log('Email sent successfully'),
      error: (error) => console.error('Error sending email:', error)
    });
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

  getAllApprovedLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(leaves => leaves.filter(leave => leave.status === 'Approved'))
    );
  }
}