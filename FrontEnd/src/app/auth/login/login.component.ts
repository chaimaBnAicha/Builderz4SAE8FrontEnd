import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface LoginResponse {
  username: string;
  password: string;

  // add other user properties as needed
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful', response);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigate(['/dashboard']);
      },
      error: (error: Error) => {
        console.error('Login failed', error);
      }
    });
  }
}