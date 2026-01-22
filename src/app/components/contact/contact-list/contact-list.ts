import {
  Component,
  DOCUMENT,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { ContactService } from '../../../services/contact/contact-service';
import { Add } from './add/add';

/**
 * Component for displaying and managing the contact list
 * Shows contacts grouped alphabetically by first letter of firstname
 * Provides functionality to add new contacts and select contacts for details
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, Add],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss'],
})
export class ContactList {
  /** Event emitter for notifying parent when contact is clicked */
  @Output() detailClicked = new EventEmitter<ContactInterface>();

  /** Contacts grouped by first letter of firstname */
  groupedContacts: Record<string, ContactInterface[]> = {};

  /** Array of group keys (letters) for iteration */
  groupedKeys: string[] = [];

  /** Flag to control add contact modal visibility */
  isClicked: boolean = false;

  /** ID of currently active/selected contact */
  activeSection: any = '';

  /**
   * Creates an instance of ContactList
   * @param contactService - Service for contact operations
   * @param renderer - Angular renderer for DOM manipulation
   * @param document - Document reference for body class manipulation
   */
  constructor(
    public contactService: ContactService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Updates grouped contacts on every change detection cycle
   * Retrieves grouped contacts from service and extracts group keys
   */
  ngDoCheck() {
    this.groupedContacts = this.contactService.getGroupedContacts();
    this.groupedKeys = Object.keys(this.groupedContacts);
  }

  /**
   * Opens the add contact modal
   * Adds CSS class to body to prevent scrolling
   */
  openAddContact() {
    this.isClicked = true;
    this.renderer.addClass(this.document.body, 'contact_open');
  }

  /**
   * Closes the add contact modal
   * Removes CSS class from body to restore scrolling
   */
  handleClose() {
    this.isClicked = false;
    this.renderer.removeClass(this.document.body, 'contact_open');
  }

  /**
   * Shows contact details for selected contact
   * Emits detail clicked event and sets active section
   * @param item - Contact to display details for
   */
  showDetails(item: ContactInterface) {
    this.detailClicked.emit(item);
    this.activeSection = item.id;
  }

  /**
   * Selects the next available contact after deletion
   * If contacts exist, selects first contact and shows details
   * @param deletedId - ID of the deleted contact
   */
  selectNextContact(deletedId: string) {
    const allContacts = Object.values(this.groupedContacts).flat();

    if (allContacts.length === 0) {
      this.activeSection = null;
      return;
    }

    const nextContact = allContacts[0];
    this.activeSection = nextContact.id;
    this.detailClicked.emit(nextContact);
  }
}
