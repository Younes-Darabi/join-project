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
  @HostBinding('style.display') display = 'none';

  user: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    type: '',
  };
  shortName: string = '';

  showEdit($event: ContactInterface) {
    this.user = $event;
    this.display = 'flex';
    this.shortName = this.user.firstname.substring(0, 1)+this.user.lastname.substring(0, 1);
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