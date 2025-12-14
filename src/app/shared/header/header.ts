import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [NgStyle, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  menu: boolean = false;
  userShort: string = 'GA';

  ngOnInit() {
    this.loadUserData();
  }

  logOut(){
    this.authService.logout()
    this.userShort = 'GA';
  }

  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isLogin) {
      this.userShort = fullName.firstName[0] + fullName.lastName[0];
    }
  }
}