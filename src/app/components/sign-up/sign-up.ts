import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { SignUpInterface } from '../../interfaces/sign-up/sign-up.interface';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Component for user registration
 * Handles new user sign-up with validation and error handling
 * Provides password confirmation and privacy policy acceptance
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  /** Authentication service for user registration */
  authService = inject(AuthService);

  /** New user registration data */
  user: SignUpInterface = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  };

  /** Flag indicating privacy policy acceptance */
  privacy: boolean = false;

  /** Flag indicating password mismatch */
  checkMatchPassword: boolean = false;

  /** Password confirmation field value */
  confirmPassword: string = '';

  /** Flag indicating successful registration */
  success: boolean = false;

  /** Error message to display to user */
  error: string = '';

  /**
   * Creates an instance of SignUp
   * @param router - Router for navigation after successful registration
   */
  constructor(private router: Router) { }

  /**
   * Handles sign-up form submission
   * Validates passwords, privacy acceptance, and creates new user
   * Navigates to login page on success
   * @param signupForm - Angular form containing user data
   */
  async onSubmit(signupForm: NgForm) {
    this.error = '';
    this.checkMatchPassword = this.checkMatchPasswords();
    if (this.checkMatchPassword) this.error = "Your passwords don't match. Please try again.";
    if (this.user.password.length < 6) this.error = 'The password must be at least 6 characters long.';
    if (!signupForm.invalid && !this.checkMatchPassword && this.privacy) {
      try {
        await this.authService.signUp(this.user);
        this.success = true;
        setTimeout(() => {
          this.success = false;
          this.router.navigate(['/log-in']);
        }, 3000);

      } catch (error: any) {
        const errorCode = error.code;
        this.error = this.getErrorMessage(errorCode);
      }
    }
  }

  /**
   * Checks if password and confirm password fields match
   * @returns True if passwords do not match
   */
  checkMatchPasswords() {
    return (this.user.password !== this.confirmPassword);
  }

  /**
   * Translates Firebase error codes to user-friendly messages
   * @param errorCode - Firebase authentication error code
   * @returns User-friendly error message
   */
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email address is already in use.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/weak-password':
        return 'The password must be at least 6 characters long.';
      default:
        return 'Unknown error: ' + errorCode;
    }
  }
}
