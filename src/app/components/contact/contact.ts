import { Component, signal, ViewChild } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { Details } from './details/details';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ContactService } from '../../services/contact/contact-service';
import { ContactService } from '../../services/contact/contact-service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Details, FormsModule, NgClass],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
})
export class Contact {
  @ViewChild(Details) Details!: Details;

  // Responsive Signal
  isMobile = signal(window.innerWidth <= 800);

  // Aktuell ausgewählter Kontakt
  selectedContact = signal<ContactInterface | null>(null);
  selectedContactOpen = signal<boolean>(false);

  constructor(private contactService: ContactService) {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth <= 800);
    });
    this.allContacts = contactService.getAllContacts();
  }

  showDetail(contact: ContactInterface) {
    this.selectedContact.set(contact);
    this.selectedContactOpen.set(true);
    if (this.isMobile()) {
      this.Details.showDetailRes();
    }
  }

  closeView() {
    this.selectedContactOpen.set(false);
  }

  onContactDeleted(contact: ContactInterface) {
    this.contactService.deleteContact(contact);
    const allContacts = this.contactService.contactList; // flaches Array
    const index = allContacts.findIndex((c) => c.id === contact.id);
    const nextContact = allContacts[index] || allContacts[index - 1] || null;
    this.selectedContact.set(nextContact);
    this.selectedContactOpen.set(!!nextContact);
    if (!nextContact && this.Details) {
      this.Details.contact = null as any;
    }
  }
}
