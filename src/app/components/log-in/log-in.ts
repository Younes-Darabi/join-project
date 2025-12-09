import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, CommonModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  loginError: boolean = false;
  login: Login = {
    email: '',
    password: '',
  };


  onSubmit() {
    if (this.login.email && this.login.password) {
      this.loginError = false;
    } else {
      this.loginError = true;
    }
  }
}
