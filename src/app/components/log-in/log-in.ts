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
  loginError: boolean = false;

  constructor(private router: Router) { }

  onSubmit() {
    if (this.login.email && this.login.password) {
      this.loginError = false;
      this.router.navigate(['main-page']);
      this.authService.isLogin = true;
    } else {
      this.loginError = true;
    }
  }
}