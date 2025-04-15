import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8081/api/meetings';

  constructor(private http: HttpClient) {}

  createMeeting(meetingData: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/create`, meetingData, { headers });
  }

  getMeeting(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getAllMeetings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}