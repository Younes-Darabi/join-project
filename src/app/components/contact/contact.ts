import { Component, signal } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { Details } from './details/details';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Details],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {

  // Responsive Signal
  isMobile = signal(window.innerWidth <= 800);

  // Aktuell ausgewählter Kontakt
  selectedContact = signal<ContactInterface | null>(null);

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth <= 800);
    });
  }

  showDetail(contact: ContactInterface) {
    this.selectedContact.set(contact);
  }

  closeView() {
    this.selectedContact.set(null);
  }
}
