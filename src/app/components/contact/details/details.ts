import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';
import { Edit } from './edit/edit';

/**
 * Component for displaying contact details
 * Shows full contact information with options to edit or delete
 * Provides responsive view with back navigation and menu
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [Edit],
  templateUrl: './details.html',
  styleUrls: ['./details.scss'],
})
export class Details {
  /** Contact service for Firebase operations */
  firebaseService = inject(ContactService);

  /** Flag to control edit modal visibility */
  isClicked: boolean = false;

  /** Signal for menu open/close state */
  menuOpen = signal(false);

  /** Contact object to display */
  @Input() contact!: ContactInterface;

  /** Flag indicating if contact was clicked */
  @Input() contactClicked: boolean = false;

  /** Event emitter for closing details view */
  @Output() close = new EventEmitter<void>();

  /** Event emitter for notifying parent of contact deletion */
  @Output() contactDeleted = new EventEmitter<ContactInterface>();

  /** Flag to show details in responsive view */
  showDetail: boolean = false;

  /** Flag to show contact title in responsive view */
  contactTitleShow: boolean = false;

  /**
   * Gets initials from contact firstname and lastname
   * @returns Two-letter initials string
   */
  get shortName(): string {
    return this.contact
      ? (this.contact.firstname?.charAt(0) || '') + (this.contact.lastname?.charAt(0) || '')
      : '';
  }

  /**
   * Creates an instance of Details
   * @param elementRef - Reference to component element for click detection
   */
  constructor(private elementRef: ElementRef) {}

  /**
   * Toggles menu visibility state
   */
  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  /**
   * Closes menu when clicking outside the component
   * @param event - Mouse event for click detection
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.menuOpen.set(false);
    }
  }

  /**
   * Deletes the current contact from Firebase
   * Closes details view after deletion
   */
  deleteContact() {
    if (!this.contact?.id) return;
    this.firebaseService.deleteContact(this.contact);
    this.close.emit();
  }

  /**
   * Shows the edit contact modal
   */
  showEdit() {
    this.isClicked = true;
  }

  /**
   * Closes the edit contact modal
   */
  handleClose() {
    this.isClicked = false;
  }

  /**
   * Shows contact details in responsive view
   */
  showDetailRes() {
    this.showDetail = true;
    this.contactTitleShow = true;
  }

  /**
   * Navigates back from contact details
   * Hides contact title and emits close event
   */
  back() {
    this.close.emit();
    this.contactTitleShow = false;
  }

  /**
   * Handles contact deletion from edit component
   * Emits deletion event to parent and closes all modals
   * @param contact - Contact that was deleted
   */
  deleteContactFromParent(contact: ContactInterface) {
    // Weiterleiten an Parent
    this.contactDeleted.emit(contact);

    // Details-Fenster schließen
    this.close.emit();

    // Edit schließen
    this.handleClose();
  }
}
