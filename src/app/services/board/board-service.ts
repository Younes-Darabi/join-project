import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs, onSnapshot, DocumentData } from 'firebase/firestore';
import { Observable, from } from 'rxjs';

// Add User type if not imported
type User = {
  id: string;
  name: string;
  // ...other user properties...
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  firestore: Firestore = inject(Firestore);
  usersSignal = signal<User[]>([]);

  // Einmaliges Laden (Promise -> Observable)
  loadUsersOnce$(): Observable<User[]> {
    const colRef = collection(this.firestore, 'users');
    const q = query(colRef, orderBy('name', 'asc'));
    return from(
      getDocs(q).then((snap) =>
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as DocumentData) }) as User)
      )
    );
  }

  // Realtime-Stream: setzt Signal und gibt Unsubscribe zurück
  subscribeUsersRealtime(onError?: (e: unknown) => void): () => void {
    const colRef = collection(this.firestore, 'users');
    const q = query(colRef, orderBy('name', 'asc'));
    return onSnapshot(
      q,
      (snap) => {
        const users = snap.docs.map(
          (doc) => ({ id: doc.id, ...(doc.data() as DocumentData) }) as User
        );
        this.usersSignal.set(users);
      },
      (err) => onError?.(err)
    );
  }
}
