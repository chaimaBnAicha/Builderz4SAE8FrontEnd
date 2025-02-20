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
    return this.http.post(`${this.apiUrl}/add-advance`, advance);
  }

  getAdvances() {
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-advances`);
  }

  deleteAdvance(id: number) {
    return this.http.delete(`${this.apiUrl}/remove-advance/${id}`);
  }

  updateAdvance(advance: any) {
    return this.http.put(`${this.apiUrl}/modify-advance`, advance);
  }

  getAdvanceById(id: number) {
    return this.http.get(`${this.apiUrl}/retrieve-advance/${id}`);
  }
}
