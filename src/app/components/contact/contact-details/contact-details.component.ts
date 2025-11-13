import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ContactInterface } from '../contact-interface';
import { CommonModule } from '@angular/common';
//import { EditContactDialogComponent } from '../edit-contact-dialog/edit-contact-dialog.component';
import { RouterModule } from '@angular/router';
//import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

/**
 * The ContactDetailsComponent displays the details of a specific contact and provides options to edit, delete,
 * or close the contact details. It emits events to notify parent components of changes.
 *
 * @selector app-contact-details
 * @example
 * <app-contact-details [contact]="selectedContact" (openDetails)="onDetailsOpened($event)" (contactDeleted)="onContactDeleted()"></app-contact-details>
 */
@Component({
  selector: 'app-contact-details',  // The HTML tag used to reference this component.
  standalone: true,                 // Marks the component as standalone.
  imports: [CommonModule,  RouterModule],  // Imports required modules and components.
  templateUrl: './contact-details.component.html',  // Path to the HTML template for this component.
  styleUrls: ['./contact-details.component.scss']  // Path to the stylesheet for this component.
})
export class ContactDetailsComponent {
  /**
   * The contact object passed as an input to display the contact's details.
   * @type {ContactInterface}
   */
  @Input() contact!: ContactInterface;

  /**
   * A flag that indicates whether a contact was successfully created.
   * @type {boolean}
   */
  @Input() contactIsSuccessfully: boolean = false;

  /**
   * The current contact object, updated after any change or creation of a contact.
   * @type {ContactInterface}
   */
  currentContact!: ContactInterface;

  /**
   * A flag that indicates whether the contact is being edited.
   * @type {boolean}
   */
  isEdited: boolean = false;

  /**
   * A flag indicating whether the delete dialog is open.
   * @type {boolean}
   */
  isDeleteOpen: boolean = false;

  /**
   * A flag indicating whether the contact details dialog is open.
   * @type {boolean}
   */
  isDialogOpen: boolean = false;

  /**
   * A flag to track whether the menu is open or not.
   * @type {boolean}
   */
  menuOpen = false;

  /**
   * A flag that controls whether the contact details are visible.
   * @type {boolean}
   */
  isVisible: boolean = true;

  /**
   * An output event emitter that notifies the parent component when the details of a contact are opened.
   * @type {EventEmitter<ContactInterface>}
   */
  @Output() openDetails = new EventEmitter<ContactInterface>();

  /**
   * An output event emitter that notifies the parent component when the contact has been deleted.
   * @type {EventEmitter<void>}
   */
  @Output() contactDeleted = new EventEmitter<void>();

  /**
   * An output event emitter that notifies the parent component to close the contact details view.
   * @type {EventEmitter<void>}
   */
  @Output() closeDetails = new EventEmitter<void>();

  /**
   * Toggles the visibility of the menu (open or close).
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;  // Toggles the menu open/close state.
  }

  /**
   * Closes the contact details view and emits an event to notify the parent component.
   */
  toggleCloseDetails() {
    this.closeDetails.emit();  // Emits an event to notify the parent component to close the details view.
    this.isVisible = false;    // Hides the contact details view.
  }

  /**
   * Updates the contact and shows a success message if the contact doesn't already have an ID.
   * Emits the updated contact details to the parent component.
   * 
   * @param {ContactInterface} newContact - The newly created or updated contact.
   */
  onContactCreated(newContact: ContactInterface) {
    this.contact = newContact;  // Updates the contact with the newly created or updated contact.

    // If the contact doesn't have an ID, it means it's a newly created contact, so show the success message.
    if (!this.contact.id) {
      this.contactIsSuccessfully = true;
      
      setTimeout(() => {
        const successElement = document.querySelector('.succesfull_content');
        
        if (successElement) {
          successElement.classList.add('dialog-closed');  // Closes the success message.
        }

        // Resets the success flag after a short delay.
        setTimeout(() => {
          this.contactIsSuccessfully = false;
        }, 500);
      }, 1000);
    }
  }

  /**
   * Opens the edit contact dialog to allow the user to edit the contact's details.
   */
  openEditDialog() {
    this.isEdited = true;  // Sets the edited flag to true to indicate the edit dialog is open.
  }

  /**
   * Opens the details view for the specified contact.
   * 
   * @param {ContactInterface} contact - The contact whose details are to be viewed.
   */
  openDialogDetails(contact: ContactInterface) {
    this.currentContact = contact;  // Sets the current contact to the selected contact.
  }

  /**
   * Opens the delete contact dialog.
   */
  openDeleteContact() {
    this.isDeleteOpen = true;  // Sets the flag to indicate the delete dialog is open.
  }

  /**
   * Emits an event to notify the parent component that the contact has been deleted.
   */
  handleContactDeleted() {
    this.contactDeleted.emit();  // Emits the event that the contact has been deleted.
  }

  /**
   * Stops the propagation of the event to prevent it from bubbling up to parent elements.
   * This is used to prevent unintended behavior when interacting with the menu or dialog.
   * 
   * @param {Event} event - The event to stop propagation for.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();  // Stops the event from propagating.
  }

  /**
   * Closes the contact details dialog and resets all related flags.
   * It also ensures that the dialog is closed smoothly by applying a transition.
   */
  closeDialog() {
    const dialogElement = document.querySelector('.custom-dialog');
    this.isDialogOpen = false;  // Closes the dialog.

    if (dialogElement) {
      dialogElement.classList.add('dialog-closed');  // Adds the 'dialog-closed' class to close the dialog with a transition.
      this.isDialogOpen = false;
      
      setTimeout(() => {
        this.isDialogOpen = false;  // Resets the dialog open flag.
        this.isDeleteOpen = false;  // Resets the delete dialog flag.
        this.isEdited = false;      // Resets the edit dialog flag.
      }, 500);
    } else {
      this.isDialogOpen = false;  // Directly closes the dialog if no dialog element is found.
    }
  }

  /**
   * Listens for clicks on the document and closes the menu if a click is detected outside of the menu.
   * 
   * @param {Event} event - The click event.
   */
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    // Checks if the click was outside of the menu and closes the menu if so.
    if (!targetElement.closest('.three_dot_menu') && !targetElement.closest('.dropdown_menu')) {
      this.menuOpen = false;
    }
  }
}
