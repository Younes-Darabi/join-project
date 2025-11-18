import { Component, EventEmitter, HostBinding, inject, Output } from '@angular/core';
import { ContactService } from '../../../services/contact/contact-service';
import { ContactInterface } from '../../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  firebaseService = inject(ContactService);
  contact: ContactInterface = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    type: '',
  };

  shortName: string = '';
  @Output() editClicked = new EventEmitter<ContactInterface>();

  showDetail($event: ContactInterface) {
    this.contact = $event;
    this.shortName = this.contact.firstname.substring(0, 1) + this.contact.lastname.substring(0, 1);
  }

  showEdit() {
    this.editClicked.emit(this.contact);
  }

  clear() {
    this.contact = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      type: '',
    };
  }

  deleteContact() {
    this.firebaseService.deleteContact(this.contact);
    this.clear();
  }
}
