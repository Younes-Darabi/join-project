import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact-service';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { getDocs } from 'firebase/firestore';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.scss'],
})
export class AddTask {
  contactService = inject(ContactService);

  contactList: ContactInterface[] = [];
  search: string = '';
  open: boolean = false;
  selected: ContactInterface[] = [];

  // Beispiel: Deine eigene E-Mail-Adresse
  yourEmail: string = 'deine@email.de';

  setIsYouForContacts() {
    this.contactList = this.contactList.map(contact => ({
      ...contact,
      isYou: contact.email === this.yourEmail
    }));
  }

  sortContactsAlphabetically(contacts: ContactInterface[]): ContactInterface[] {
    return contacts.slice().sort((a, b) => a.firstname.localeCompare(b.firstname));
  }

  async ngOnInit() {
    let collectionRef = this.contactService.getContactsRef();
    let snapshot = await getDocs(collectionRef);
    let loadedContacts = snapshot.docs.map(doc =>
      this.contactService.setContactObject(doc.data(), doc.id)
    );
    this.contactList = this.sortContactsAlphabetically(loadedContacts);
    this.setIsYouForContacts();
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let input = document.getElementById('assigned_dropdown_input');
    let dropdownList = document.querySelector('.assigned_dropdown_list');
    if (
      input &&
      !input.contains(target) &&
      dropdownList &&
      !dropdownList.contains(target)
    ) {
      this.open = false;
    }
  }

  filterUsers() {
    let searchTerm = this.search.trim().toLowerCase();
    if (!searchTerm) {
      this.open = true;
      this.contactList = this.sortContactsAlphabetically(this.contactList);
      return;
    }
    let filteredContacts = this.contactList.map(contact => ({
      ...contact,
      visible: `${contact.firstname} ${contact.lastname}`.toLowerCase().includes(searchTerm)
    }));
    this.contactList = this.sortContactsAlphabetically(filteredContacts);
  }

  toggleSelect(contact: ContactInterface) {
    let exists = this.selected.some(u => u.id === contact.id);
    if (exists) {
      this.selected = this.selected.filter(u => u.id !== contact.id);
    } else {
      this.selected = [...this.selected, contact];
    }
  }

  isContactSelected(contact: ContactInterface): boolean {
    return this.selected.some(selectedContact => selectedContact.id === contact.id);
  }

  getDropdownItemClass(contact: ContactInterface): string {
    return this.isContactSelected(contact) ? 'assigned_dropdown_item_active' : '';
  }
}
// ich muss auf die contatclist aus dem contactservice zugreifen

// Das dropdown Menü mit html tags schreiben
// Die Kontakte anzeigen lassen mit checkbox