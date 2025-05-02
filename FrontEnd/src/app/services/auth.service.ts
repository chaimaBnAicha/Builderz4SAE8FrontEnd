import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';  // Added catchError for error handling
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) { }

  // Signup method
  signup(signupData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  // Login method with improved error handling
  login(credentials: {username: string, password: string}): Observable<any> {
    console.log('Attempting login with credentials:', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials, {
        withCredentials: true
    }).pipe(
        tap((response: any) => {
            console.log('Login successful, response:', response);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
        }),
        catchError((error) => {
            console.error('Login error details:', error);
            throw error;
        })
    );
}
  
  

  // Forgot password method
  forgotPassword(email: string): Observable<any> {
    console.log('Sending forgot password request:', { email });
    return this.http.post(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        tap((response: any) => {
          console.log('Forgot password response:', response);
        }),
        catchError((error) => {
          console.error('Forgot password error:', error);
          throw error;
        })
      );
  }

  // Reset password method
  resetPassword(email: string, newPassword: string): Observable<any> {
    console.log('Sending reset password request:', { email });
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email: email,
      newPassword: newPassword
    }).pipe(
      tap((response: any) => {
        console.log('Reset password response:', response);
      }),
      catchError((error) => {
        console.error('Reset password error:', error);
        throw error;
      })
    );
  }

  // Email verification method
  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify?token=${token}`);
  }

  // Method to get user ID from localStorage
  getUserId(): number {
    const userData = localStorage.getItem('currentUser');
    console.log('Getting user from localStorage:', userData);
    if (userData) {
      const user = JSON.parse(userData);
      console.log('User ID:', user.id);
      return user.id;  // Make sure the user object contains an `id` field
    }
    return 0;  // Default ID if user is not found
  }

  // Method to get the current user data from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    console.log('Getting currentUser from localStorage:', user);
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing currentUser from localStorage:', e);
      return null;  // Return null if there's an error during parsing
    }
  }

  // Method to get the authentication token from localStorage
  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Getting token from localStorage:', token);
    return token;  // Return token stored in localStorage
  }

  // Example method to get authentication headers (use token)
  getAuthHeaders() {
    const token = this.getToken();
    if (!token) {
      console.error('No token found in localStorage!');
      throw new Error('No token found in localStorage');
    }
    console.log('Auth token found:', token);
    return { Authorization: `Bearer ${token}` };  // Return the token as a Bearer authorization header
  }
}
