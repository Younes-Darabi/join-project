import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../services/contact/contact-service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  firebaseService = inject(ContactService);
  privacy: boolean = false;
  checkMatchPassword: boolean = false;
  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    type: ''
  };
  confirmPassword: string = '';
  success: boolean = false;

  constructor(private router: Router) {}

  onSubmit(signupForm: NgForm) {
    this.checkMatchPassword = this.checkMatchPasswords();
    if (!signupForm.invalid && !this.checkMatchPassword && this.privacy) {
      this.success = true;

      this.firebaseService.addContact(this.user);
      this.firebaseService.contactList.push(JSON.parse(JSON.stringify(this.user)));

      setTimeout(() => {
        this.success = false;
        this.router.navigate(['log-in']);
      }, 3000);

    }
  }

  checkMatchPasswords() {
    if (this.user.password.length < 6 || this.user.password !== this.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

}
