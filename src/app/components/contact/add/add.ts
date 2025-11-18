import { Component, EventEmitter, HostBinding, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';


@Component({
  selector: 'app-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  firebaseService = inject(ContactService);
  @HostBinding('style.display') display = 'none';

  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    type: '',
  };

  addUser() {
  this.firebaseService.addContact(this.user);
  this.firebaseService.contactList.push(JSON.parse(JSON.stringify(this.user)));
  this.close();
}

  @Output() closeAddContact = new EventEmitter<void>();

  close() {
    this.closeAddContact.emit();
  }

  show() {
    this.display = 'flex';
  }
}
