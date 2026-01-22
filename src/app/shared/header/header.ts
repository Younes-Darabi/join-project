import { NgStyle } from '@angular/common';
import { Component, inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth/auth-service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

/**
 * Header component for the application
 * Displays user information and provides logout functionality
 * Shows user initials and dropdown menu
 * 
 * @author Kevin Hase
 */
@Component({
  selector: 'app-header',
  imports: [NgStyle, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  /** Authentication service for user management */
  authService = inject(AuthService);
  
  /** Reference to component element for click detection */
  private elementRef = inject(ElementRef);
  
  /** Flag to control dropdown menu visibility */
  menu: boolean = false;
  
  /** User initials to display in header */
  userShort: string = 'GA';

  /**
   * Initializes component and sets up authentication state listener
   * Loads user data when authentication state changes
   */
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

  /**
   * Closes dropdown menu when clicking outside the component
   * @param event - Click event for detection
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    let clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (this.menu && !clickedInside) {
      this.menu = false;
    }
  }

  /**
   * Logs out the current user
   * Resets user initials to guest default
   */
  logOut() {
    this.authService.logout();
    this.userShort = 'GA';
  }

  /**
   * Loads current user data and updates user initials
   * Sets initials from first and last name or defaults to guest
   */
  async loadUserData() {
    const fullName = await this.authService.getCurrentFullName();
    if (fullName && this.authService.isAuthenticated) {
      this.userShort = fullName.firstName[0] + fullName.lastName[0];
    } else {
      this.userShort = 'GA';
    }
  }
}
