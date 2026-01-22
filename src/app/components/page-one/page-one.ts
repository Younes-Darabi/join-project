import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component for the initial splash screen
 * Displays animation and automatically navigates to login page
 * Handles responsive behavior for mobile devices
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-page-one',
  imports: [],
  templateUrl: './page-one.html',
  styleUrl: './page-one.scss',
})
export class PageOne {
  /** Flag indicating if viewport is mobile size */
  isMobile = window.innerWidth <= 700;

  /** Flag to control animation state */
  animation: boolean = false;

  /**
   * Creates an instance of PageOne
   * Starts animation after 2 seconds and navigates to login after 3 seconds
   * @param router - Router for navigation to login page
   */
  constructor(private router: Router) {
    setTimeout(() => {
      this.animation = true;
    }, 2000);
    setTimeout(() => {
      this.router.navigate(['log-in']);
    }, 3000);
  }

  /**
   * Updates mobile flag on window resize
   */
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 480;
  }
}
