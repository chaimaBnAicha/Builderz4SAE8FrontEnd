import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveStatisticsService {
  private apiUrl = 'http://localhost:8081/leave';

  constructor(private http: HttpClient) { }

  getLeaveCountByType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leave-count-by-type`);
  }

  getAverageLeaveDuration(): Observable<any> {
    return this.http.get(`${this.apiUrl}/average-leave-duration`);
  }

  getLeavesByMonth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaves-by-month`);
  }
} 