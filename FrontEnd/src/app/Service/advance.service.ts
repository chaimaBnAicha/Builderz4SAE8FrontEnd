import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



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
    return this.http.put(`${this.apiUrl}/update-status/${id}`, { status: status });
  }

  canApproveAdvance(userId: number, advanceId: number) {
    return this.http.get<boolean>(`${this.apiUrl}/can-approve?userId=1&advanceId=${advanceId}`);
  }
}
