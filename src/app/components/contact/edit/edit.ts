import { Component, HostBinding, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})

export class Edit {
  firebaseService = inject(ContactService);
  @HostBinding('style.display') display = 'flex';

  user: ContactInterface;

  // constructor(contact: ContactInterface) {
  //   this.user = contact;
  // }

  constructor() {
    this.user = {
      id: 'sara.müller@gmail.com',
      firstname: 'Sara Müller',
      lastname: 'Mueller',
      email: '',
      phone: '+41763457669',
      type: '',
    };
  }

  editContact() {
    this.firebaseService.updateContact(this.user);
    this.close();
  }

  deleteContact() {
    this.firebaseService.deleteContact(this.user);
    this.close();
  }


  close() {
    this.display = 'none';
  }

}

