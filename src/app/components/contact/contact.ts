import { Component, signal, ViewChild } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { Details } from './details/details';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactList, Details, FormsModule, NgClass],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class Contact {
  @ViewChild(Details) Details!: Details;

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
    if (this.isMobile()) {
      this.Details.showDetailRes();
    }
  }

  closeView() {
    this.selectedContact.set(null);
  }
}
