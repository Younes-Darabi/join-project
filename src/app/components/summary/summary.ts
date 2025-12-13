import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  authService = inject(AuthService);
  userName: string = '';

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isLogin) {
      this.userName = fullName.firstName + ' ' + fullName.lastName;
    } else {
      this.userName = '';
    }
  }
}
