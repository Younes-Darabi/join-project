import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnDestroy {
  contactList: ContactInterface[] = [];

  firestore: Firestore = inject(Firestore);
  unsubContacts;
  readonly colors = [
    '#FF7A00',
    '#FF5EB3',
    '#9327FF',
    '#6E52FF',
    '#FC71FF',
    '#FFE62B',
    '#FFBB2B',
    '#C3FF2B',
    '#1FD7C1',
    '#462F8A',
    '#FF4646',
    '#00BEE8',
    '#FF745E',
    '#FFA35E',
    '#FFC701',
    '#0038FF',
  ];

  constructor() {
    this.unsubContacts = onSnapshot(
      collection(this.firestore, 'users'),
      (list) => {
        this.contactList = [];
        list.forEach((element) => {
          this.contactList.push(this.setContactObject(element.data(), element.id));
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.unsubContacts) {
      this.unsubContacts();
    }
  }

  async addContact(user: ContactInterface) {
    const cleanContact = this.getCleanContactJson(user);
    await addDoc(this.getContactsRef(), cleanContact)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Contact successfully added', docRef?.id);
      });
  }

  async updateContact(contact: ContactInterface) {
    if (contact.id) {
      const docRef = this.getSingleDocRef(this.getCollectionId(contact), contact.id);
      const cleanContact = this.getCleanContactJson(contact);
      await updateDoc(docRef, cleanContact)
        .then(() => {
          console.log('Contact successfully updated');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async deleteContact(user: ContactInterface) {
    if (user.id) {
      await deleteDoc(doc(this.firestore, 'users', user.id));
    }
  }

  getCleanContactJson(contact: ContactInterface): {} {
    return {
      email: contact.email,
      firstname: contact.firstname,
      lastname: contact.lastname,
      phone: contact.phone,
      type: contact.type,
    };
  }

  getCollectionId(contact: ContactInterface): string {
    return 'users';
  }

  getContactsRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setContactObject(obj: any, id: string): ContactInterface {
    let initials = '';
    if (obj.firstname && obj.lastname) {
      initials = `${obj.firstname.charAt(0)}${obj.lastname.charAt(0)}`.toUpperCase();
    }
    let color = this.getColorForContact({ ...obj, id });
    return {
      id: id || '',
      email: obj.email || '',
      firstname: obj.firstname || '',
      lastname: obj.lastname || '',
      phone: obj.phone || '',
      type: obj.type || 'contact',
      initials: initials,
      color: color,
    };
  }

  getColorForContact(contact: ContactInterface | any): string {
    const key = contact.id;
    let hash = 0;

    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % this.colors.length;
    return this.colors[index];
  }

  getInitials(firstName: string, lastName: string): string {
    let firstInitial = firstName?.charAt(0).toUpperCase() || '';
    let lastInitial = lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  getGroupedContacts(): Record<string, ContactInterface[]> {
    const grouped = new Map<string, ContactInterface[]>();
    for (const contact of this.contactList) {
      const letter = this.getGroupKey(contact);
      if (!grouped.has(letter)) {
        grouped.set(letter, []);
      }
      grouped.get(letter)!.push(contact);
    }
    for (const [key, list] of grouped) {
      grouped.set(key, this.sortContacts(list));
    }
    return this.sortKeys(grouped);
  }

  getGroupKey(contact: ContactInterface): string {
    return contact.firstname?.charAt(0).toUpperCase() || '';
  }

  sortContacts(list: ContactInterface[]): ContactInterface[] {
    return list.sort((a, b) => a.firstname.localeCompare(b.firstname));
  }

  sortKeys<T>(map: Map<string, T[]>): Record<string, T[]> {
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((acc, [key, list]) => {
        acc[key] = list;
        return acc;
      }, {} as Record<string, T[]>);
  }

  async loadContactsFromFirebase() {
    let collectionRef = this.getContactsRef();
    let snapshot = await getDocs(collectionRef);
    this.contactList = snapshot.docs.map((doc) => this.setContactObject(doc.data(), doc.id));
  }

  getAllContacts(): ContactInterface[] {
    return [...this.contactList];
  }
}
