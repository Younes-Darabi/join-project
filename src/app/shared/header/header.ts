import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth/auth-service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [NgStyle, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  authService = inject(AuthService);
  menu: boolean = false;
  userShort: string = 'GA';

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.loadUserData();
      } else {
        this.userShort = 'GA';
      }
    });
  }

  logOut() {
    this.authService.logout();
    this.userShort = 'GA';
  }

  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isLogin) {
      this.userShort = fullName.firstName[0] + fullName.lastName[0];
    } else {
      this.userShort = 'GA';
    }
  }
}
