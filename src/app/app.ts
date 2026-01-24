import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth-service';
import { Navbar } from "./shared/navbar/navbar";

/**
 * Root application component
 * Main entry point for the Angular application
 * Manages authentication state and layout structure
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Authentication service for user management */
  authService = inject(AuthService);
  /** Router to detect current URL */
  router = inject(Router);

  /** Returns true when current route is log-in or sign-up */
  isOnAuthPages(): boolean {
    const url = this.router.url.split('?')[0] || '';
    return url === '/log-in' || url === '/sign-up' ||url === '/';
  }

  /** Returns true when current route is privacy-policy or legal-notice */
  isPrivacyOrLegal(): boolean {
    const url = this.router.url.split('?')[0] || '';
    return url === '/privacy-policy' || url === '/legal-notice';
  }
}