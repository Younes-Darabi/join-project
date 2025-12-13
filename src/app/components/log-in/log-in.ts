import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LogInInterface } from '../../interfaces/log-in/log-in.interface';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  authService = inject(AuthService);
  login: LogInInterface = {
    email: '',
    password: '',
  };
  error: string = '';

  constructor(private router: Router) { }

  async onSubmit() {
    this.error = '';

    if (this.login.email && this.login.password) {
      try {
        await this.authService.signIn(this.login);
        this.router.navigate(['main-page']);
        this.authService.isLogin = true;


      } catch (error: any) {
        this.error = this.getErrorMessage(error.code);
      }
    } else {
      this.error = 'Please enter both email and password.';
    }
  }

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect password or invalid credentials.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily blocked due to too many failed login attempts. Please try again later.';
      default:
        return 'Login failed. Please check your credentials.';
    }
  }
}