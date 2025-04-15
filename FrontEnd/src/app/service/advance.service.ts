import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Advance } from '../models/advance.model';



@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  private apiUrl = 'http://localhost:8081/advance';  

  constructor(private http: HttpClient) { }

  

  addAdvance(advance: any) {
    const advanceWithUser = {
      ...advance,
      user: { id: 1 }  // Default user ID as 1
    };
    return this.http.post(`${this.apiUrl}/add-advance`, advanceWithUser);
  }

  getAdvances() {
    return this.http.get<Advance[]>(`${this.apiUrl}/retrieve-all-advances`);
  }

  deleteAdvance(id: number) {
    return this.http.delete(`${this.apiUrl}/remove-advance/${id}`);
  }

  updateAdvance(advance: Advance) {
    return this.http.put(`${this.apiUrl}/modify-advance`, advance);
  }

  getAdvanceById(id: number) {
    return this.http.get<Advance>(`${this.apiUrl}/retrieve-advance/${id}`);
  }

  updateAdvanceStatus(id: number, status: string) {
    // First get the existing advance
    return this.http.get(`${this.apiUrl}/retrieve-advance/${id}`).pipe(
      switchMap((advance: any) => {
        // Then update its status while keeping other properties
        const updatedAdvance = {
          id: advance.id,
          amount_request: advance.amount_request,
          requestDate: advance.requestDate,
          reason: advance.reason,
          status: status,
          user: { id: 1 }  // Ensure we always send a valid user ID
        };
        
        console.log('Original advance:', advance);
        console.log('Sending update:', updatedAdvance);
        
        // Try sending a simpler object
        const simpleUpdate = {
          id: id,
          status: status,
          amount_request: advance.amount_request,
          reason: advance.reason,
          requestDate: new Date(advance.requestDate),
          user: { id: 1 }
        };

        return this.http.put(`${this.apiUrl}/modify-advance`, simpleUpdate);
      })
    );
  }

  canApproveAdvance(userId: number, advanceId: number) {
    return this.http.get<boolean>(`${this.apiUrl}/can-approve?userId=1&advanceId=${advanceId}`);
  }

  sendStatusEmail(advanceId: number, status: string, userEmail: string) {
    return this.http.post(`${this.apiUrl}/send-status-email`, {
      advanceId: advanceId,
      status: status,
      email: userEmail
    });
  }

  sendStatusNotification(advanceId: number, status: string, userId: number) {
    return this.http.post(`${this.apiUrl}/notify-status`, {
      advanceId: advanceId,
      status: status,
      userId: userId
    });
  }

  

  notifyUser(advanceId: number, status: string, userEmail: string): Observable<any> {
    const subject = "Status Update";
    const logoUrl = "https://i.imgur.com/YX34wNO.png";
    const message = `
  <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); display: inline-block; text-align: center; max-width: 600px;">
      <img src="${logoUrl}" alt="App Logo" style="max-width: 120px; margin-bottom: 20px; border-radius: 5%; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
      
      <h2 style="color: #4CAF50; margin-bottom: 10px;">Advance Request Update</h2>
      
      <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
        Your advance request has been 
        <strong style="color: ${status.toLowerCase() === 'approved' ? '#4CAF50' : '#FF5733'};">
          ${status.toLowerCase()}
        </strong>.
      </p>
      
      <p style="font-size: 14px; color: #666;">Thank you for trusting us. We are always here to serve you!</p>
      
      <a href="http://localhost:4200" style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 20px;">
        Visit Our App
      </a>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">If you have any questions, contact our support team.</p>
    </div>
  </div>
`;
  
    return this.http.post(`${this.apiUrl}/send`, null, {
      params: {
        to: userEmail,
        subject: subject,
        body: message,
        isHtml: 'true' // Add this parameter if your backend needs to differentiate HTML content
      },
      responseType: 'text'
    });
  }
  
  
}
