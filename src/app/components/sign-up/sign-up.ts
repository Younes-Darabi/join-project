import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { SignUpInterface } from '../../interfaces/sign-up/sign-up.interface';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  authService = inject(AuthService);
  user: SignUpInterface = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  };
  privacy: boolean = false;
  checkMatchPassword: boolean = false;
  confirmPassword: string = '';
  // success: boolean = false;
  error: string = '';

  constructor(private router: Router) { }

  async onSubmit(signupForm: NgForm) {
    this.error = '';
    this.checkMatchPassword = this.checkMatchPasswords();
    if (this.checkMatchPassword) this.error = "Your passwords don't match. Please try again.";
    if (this.user.password.length < 6) this.error = 'The password must be at least 6 characters long.';
    if (!signupForm.invalid && !this.checkMatchPassword && this.privacy) {
      try {
        await this.authService.signUp(this.user);
        // this.success = true;
        this.router.navigate(['/summary']);
        // setTimeout(() => {
        //   this.success = false;
        // }, 3000);

      } catch (error: any) {
        const errorCode = error.code;
        this.error = this.getErrorMessage(errorCode);
      }
    }
  }

  checkMatchPasswords() {
    return (this.user.password !== this.confirmPassword);
  }

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
