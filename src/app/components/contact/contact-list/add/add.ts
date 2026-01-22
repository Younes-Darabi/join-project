import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact/contact-service';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';

/**
 * Component for adding new contacts
 * Provides a form to create and save new contacts to Firebase
 * Emits events when contact is created or form is closed
 *
 * @author Kevin Hase
 */
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrls: ['./add.scss'],
})
export class Add {
  /** Flag indicating successful contact creation */
  success: boolean = false;

  /** Contact service for Firebase operations */
  firebaseService = inject(ContactService);

  /** New contact object being created */
  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    type: ''
  };

  /** Event emitter for notifying parent of created contact */
  @Output() contactCreated = new EventEmitter<ContactInterface>();

  /**
   * Adds new contact to Firebase and local contact list
   * Shows success message and closes form after 1 second
   */
  addUser() {
    this.firebaseService.addContact(this.user);
    this.firebaseService.contactList.push(JSON.parse(JSON.stringify(this.user)));

    this.success = true;
    this.contactCreated.emit(this.user);
    setTimeout(() => {
      this.close();
      this.success = false;
    }, 1000);
  }

  /** Event emitter for closing the add contact form */
  @Output() closeAddContact = new EventEmitter<void>();

  /**
   * Closes the add contact form
   * Emits close event to parent component
   */
  close() {
    this.closeAddContact.emit();
  }
}
