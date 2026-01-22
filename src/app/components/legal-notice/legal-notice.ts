import { Component, inject } from '@angular/core';
import {RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Component for displaying legal notice information
 * Shows legal and imprint information for the application
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {
  /** Authentication service for user state */
  authService = inject(AuthService);
}
