import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AdvanceService {
  private apiUrl = 'http://localhost:8081/BackendSyrine/advance';  

  constructor(private http: HttpClient) { }

  

  addAdvance(advance: any) {
    const advanceWithUser = {
      ...advance,
      user: { id: 1 }  // Default user ID as 1
    };
    return this.http.post(`${this.apiUrl}/add-advance`, advanceWithUser);
  }

  getAdvances() {
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-advances`);
  }

  deleteAdvance(id: number) {
    return this.http.delete(`${this.apiUrl}/remove-advance/${id}`);
  }

  updateAdvance(advance: any) {
    const advanceWithUser = {
      ...advance,
      user: { id: 1 }  // Default user ID as 1
    };
    return this.http.put(`${this.apiUrl}/modify-advance`, advanceWithUser);
  }

  getAdvanceById(id: number) {
    return this.http.get(`${this.apiUrl}/retrieve-advance/${id}`);
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
}
