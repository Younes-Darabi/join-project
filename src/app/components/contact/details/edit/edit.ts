import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact/contact-service';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';

/**
 * Component for editing contact information
 * Provides form to modify existing contact data
 * Emits events for save, delete, and close actions
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.scss'],
})
export class Edit {
  /** Contact service for Firebase operations */
  firebaseService = inject(ContactService);

  /** Contact object to edit from parent component */
  @Input() user!: ContactInterface;

  /** Event emitter for closing edit view */
  @Output() closeing = new EventEmitter();

  /** Event emitter for closing edit contact modal */
  @Output() closeEditContact = new EventEmitter();

  /** Event emitter for notifying parent of contact deletion */
  @Output() contactDeleted = new EventEmitter<ContactInterface>();

  /** Short name initials for display */
  shortName: string = '';

  /** Editable copy of the contact */
  editUser!: ContactInterface;

  /**
   * Responds to input changes
   * Creates a copy of user data and updates short name
   */
  ngOnChanges() {
    if (this.user) {
      this.editUser = { ...this.user };
      this.shortName =
        (this.editUser.firstname?.substring(0, 1) || '') +
        (this.editUser.lastname?.substring(0, 1) || '');
    }
  }

  /**
   * Saves edited contact data to Firebase
   * Closes edit modal after update
   */
  editContact() {
    this.firebaseService.updateContact(this.editUser);
    this.close();
  }

  /**
   * Deletes the contact from Firebase
   * Emits deletion event to parent and closes modal
   */
  deleteContact() {
    this.firebaseService.deleteContact(this.user);
    this.contactDeleted.emit(this.user);
    this.close();
  }

  /**
   * Closes the edit contact modal
   * Emits close event to parent component
   */
  close() {
    this.closeEditContact.emit();
  }
}
