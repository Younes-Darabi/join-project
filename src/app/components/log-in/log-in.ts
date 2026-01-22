import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LogInInterface } from '../../interfaces/log-in/log-in.interface';

/**
 * Component for user login
 * Handles user authentication and navigation to summary page
 * Provides error handling for various authentication scenarios
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-log-in',
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  /** Authentication service for user login operations */
  authService = inject(AuthService);
  
  /** Login credentials object */
  login: LogInInterface = {
    email: '',
    password: '',
  };
  
  /** Error message to display to user */
  error: string = '';

  /**
   * Creates an instance of LogIn
   * @param router - Router for navigation after successful login
   */
  constructor(private router: Router) { }

  /**
   * Handles login form submission
   * Validates credentials and navigates to summary on success
   * Displays appropriate error messages on failure
   */
  async onSubmit() {
    this.error = '';

    if (this.login.email && this.login.password) {
      try {        
        await this.authService.signIn(this.login);
        this.router.navigate(['summary']);
      } catch (error: any) {
        this.error = this.getErrorMessage(error.code);
      }
    } else {
      this.error = 'Please enter both email and password.';
    }
  }

  /**
   * Translates Firebase error codes to user-friendly messages
   * @param errorCode - Firebase authentication error code
   * @returns User-friendly error message
   */
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