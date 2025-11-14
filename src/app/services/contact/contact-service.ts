import { inject, Injectable, OnDestroy } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { User } from '../../interfaces/contact/user';


@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnDestroy {
  contactList: ContactInterface[] = [];
  unsubContacts: () => void = () => {};
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubContacts = this.subscribeToContacts();
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

  subscribeToContacts() {
    const q = query(this.getContactsRef());
    return onSnapshot(q, (list) => {
      this.contactList = [];
      list.forEach(element => {
        this.contactList.push(this.mapToContact(element.data(), element.id));

      });
    });
  }

  mapToContact(obj: any, id: string): ContactInterface {
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
      .then(() => { console.log('Contact successfully added'); })
      .catch((err) => { console.error(err); });
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


   async addUser(user: User) {
    const userId = `${user.name}_${Date.now()}`;
    await setDoc(doc(this.firestore, "users", userId), user);
  }


}