import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Signup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  privacy: boolean = false;
  checkMatchPassword: boolean = false;
  signUp: Signup = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  success : boolean = false;

  onSubmit(signupForm: NgForm) {
    this.checkMatchPassword = this.checkMatchPasswords();
    if (!signupForm.invalid && !this.checkMatchPassword && this.privacy) {
      this.success = true;
    }
  }

  checkMatchPasswords() {
    if (this.signUp.password.length < 6 || this.signUp.password !== this.signUp.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

}
