import { Injectable, inject } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface'; // Richtige Contact-Interface einbinden

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  firestore: Firestore = inject(Firestore);

  // Hier kannst du ContactInterface verwenden
  // z.B. contacts: ContactInterface[] = [];
}
