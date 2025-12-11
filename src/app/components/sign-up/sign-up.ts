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
  checkEmail: boolean = false;
  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    type: '',
  };
  confirmPassword: string = '';
  success: boolean = false;

  constructor(private router: Router) { }

  async onSubmit(signupForm: NgForm) {
    this.checkMatchPassword = this.checkMatchPasswords();

    if (!signupForm.invalid && !this.checkMatchPassword && this.privacy) {

      const emailExists = await this.firebaseService.checkEmail(this.user);

      if (!emailExists) {
        this.success = true;
        this.firebaseService.addContact(this.user);

        setTimeout(() => {
          this.success = false;
          this.router.navigate(['log-in']);
        }, 3000);

      } else {
        this.checkEmail = true;
      }
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
