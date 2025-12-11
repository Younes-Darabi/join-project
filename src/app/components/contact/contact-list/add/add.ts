import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact/contact-service';
import { ContactInterface } from '../../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add.html',
  styleUrls: ['./add.scss'],
})
export class Add {
  success: boolean = false;
  firebaseService = inject(ContactService);
  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password : '',
    type: ''
  };

  addUser() {
    this.firebaseService.addContact(this.user);
    this.firebaseService.contactList.push(JSON.parse(JSON.stringify(this.user)));

    this.success = true;
    setTimeout(() => {
      this.close();
      this.success = false;
    }, 1000);
  }

  @Output() closeAddContact = new EventEmitter<void>();

  close() {
    this.closeAddContact.emit();
  }
}
