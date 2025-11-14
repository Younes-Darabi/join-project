import { inject, Injectable, OnDestroy } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  unsubscribe;
  data: any[] = [];
  user: User | undefined;

  constructor() {
    this.unsubscribe = onSnapshot(collection(this.firestore, 'users'), (snapshot) => {
      this.data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as User
      }));
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  async addUser(user: User) {
    const userId = `${user.name}_${Date.now()}`;
    await setDoc(doc(this.firestore, "users", userId), user);
  }
}