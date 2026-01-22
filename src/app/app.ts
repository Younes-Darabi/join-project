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
}