import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Component for displaying privacy policy information
 * Shows data protection and privacy information for the application
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  /** Authentication service for user state */
  authService = inject(AuthService);
}
