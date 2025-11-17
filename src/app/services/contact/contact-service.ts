import { inject, Injectable, OnDestroy } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';


@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnDestroy {
  contactList: ContactInterface[] = [];
  unsubContacts;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubContacts = this.subContactsList();
  }

  getContactsRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  ngOnDestroy() {
    if (this.unsubContacts) {
      this.unsubContacts();
    }
  }

  subContactsList() {
    const q = query(this.getContactsRef());
    return onSnapshot(q,
      (list) => {
        this.contactList = [];
        list.forEach(element => {
          this.contactList.push(this.setContactObject(element.data(), element.id));
        });
      },
      (error) => {
      }
    );
  }

  setContactObject(obj: any, id: string): ContactInterface {
    return {
      id: id || '',
      email: obj.email || '',
      firstname: obj.firstname || '',
      lastname: obj.lastname || '',
      phone: obj.phone || '',
      type: obj.type || 'contact'
    };
  }

  async addContact(contact: ContactInterface) {
    const contactId = contact.id || `${contact.firstname}_${contact.lastname}_${Date.now()}`;
    const cleanContact = this.getCleanJson(contact);
    await setDoc(doc(this.firestore, "users", contactId), cleanContact)
      .catch((err) => { });
  }

  getCleanJson(contact: ContactInterface): {} {
    return {
      email: contact.email,
      firstname: contact.firstname,
      lastname: contact.lastname,
      phone: contact.phone,
      type: contact.type
    }
  }

  getCollectionId(contact: ContactInterface): string {
    return 'users';
  }

  async updateContact(contact: ContactInterface) {
    if (contact.id) {
      const docRef = this.getSingleDocRef(this.getCollectionId(contact), contact.id);
      const cleanContact = this.getCleanJson(contact);
      await updateDoc(docRef, cleanContact)
        .then(() => { console.log('Contact successfully updated'); })
        .catch((err) => { console.error(err); });
    }
  }

  async addUser(user: ContactInterface) {
    const userId = `${user.firstname}_${Date.now()}`;
    await setDoc(doc(this.firestore, "users", userId), user);
  }

  async deleteContact(user: ContactInterface) {
    if (user.id) {
      await deleteDoc(doc(this.firestore, "users", user.id));
    }
  }

  getFirstLetter(contact: ContactInterface): string {
    return contact.firstname?.charAt(0).toUpperCase() || '';
  }

  getGroupedContacts(): Record<string, ContactInterface[]> {
    const grouped: Record<string, ContactInterface[]> = {};

    this.contactList.forEach(contact => {
      const letter = this.getFirstLetter(contact);
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(contact);
    });

    Object.keys(grouped).forEach(letter => {
      grouped[letter].sort((a, b) => a.firstname.localeCompare(b.firstname));
    });

    const sortedGrouped = Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {} as Record<string, ContactInterface[]>);

    return sortedGrouped;
  }
}
