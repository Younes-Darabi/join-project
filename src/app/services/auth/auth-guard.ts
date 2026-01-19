import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean | UrlTree> {
    return new Promise(resolve => {
      const waitForAuth = () => {
        if (!this.authService.authReady) {
          setTimeout(waitForAuth, 10);
          return;
        }

        if (this.authService.isLoggedIn()) {
          resolve(true);
        } else {
          resolve(this.router.createUrlTree(['/log-in']));
        }
      };

      waitForAuth();
    });
  }

}
