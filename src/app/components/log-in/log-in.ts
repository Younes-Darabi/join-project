import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { RouterModule } from '@angular/router';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  loginError: boolean = false;
  login: Login = {
    email: '',
    password: '',
  };

  constructor(private router: Router) { }

  onSubmit() {
    if (this.login.email && this.login.password) {
      this.loginError = false;
    } else {
      this.loginError = true;
      // this.router.navigate(['main-page']);
    }
  }
}