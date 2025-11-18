import { Component, HostBinding, inject } from '@angular/core';
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

  addContact() {
    this.firebaseService.addUser(this.user);
    this.user.firstname = '';
    this.user.lastname = '';
    this.user.email = '';
    this.user.phone = '';
    this.close();
  }

  close() {
    this.display = 'none';
  }

  show() {
    this.display = 'flex';
  }
}
