import { Component, signal, ViewChild } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { Details } from './details/details';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ContactService } from '../../services/contact/contact-service';

/**
 * Main contact component managing contact list and details view
 * Handles responsive behavior and contact selection
 * Coordinates between contact list and detail components
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Details, FormsModule, NgClass],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
  /** Reference to Details child component */
  @ViewChild(Details) Details!: Details;

  /** Array of all contacts */
  allContacts: ContactInterface[];

  /** Signal indicating if viewport is mobile size */
  isMobile = signal(window.innerWidth <= 800);

  /** Signal holding currently selected contact */
  selectedContact = signal<ContactInterface | null>(null);

  /** Signal indicating if contact details are open */
  selectedContactOpen = signal<boolean>(false);

  /**
   * Creates an instance of Contact
   * Sets up resize listener for responsive behavior
   * @param contactService - Service for contact operations
   */
  constructor(private contactService: ContactService) {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth <= 800);
    });
    this.allContacts = contactService.contactList;
  }

  /**
   * Shows contact details for selected contact
   * Handles responsive view switching for mobile devices
   * @param contact - Contact to display details for
   */
  showDetail(contact: ContactInterface) {
    this.selectedContact.set(contact);
    this.selectedContactOpen.set(true);
    if (this.isMobile()) {
      this.Details.showDetailRes();
    }
  }

  /**
   * Closes the contact details view
   */
  closeView() {
    this.selectedContactOpen.set(false);
  }

  /**
   * Handles contact deletion event
   * Deletes contact and selects next available contact
   * @param contact - Contact that was deleted
   */
  onContactDeleted(contact: ContactInterface) {
    this.contactService.deleteContact(contact);
    const allContacts = this.contactService.contactList; // flaches Array
    const index = allContacts.findIndex((c) => c.id === contact.id);
    const nextContact = allContacts[index] || allContacts[index - 1] || null;
    this.selectedContact.set(nextContact);
    this.selectedContactOpen.set(!!nextContact);
    if (!nextContact && this.Details) {
      this.Details.contact = null as any;
    }
  }
}
