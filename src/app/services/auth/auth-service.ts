import { inject, Injectable, OnDestroy } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { SignUpInterface } from "../../interfaces/sign-up/sign-up.interface";
import { doc, Firestore, setDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  isLogin = false;
  currentUser: User | null = null;
  unsubContacts: any;

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.isLogin = !!user;
    });
  }

  async signUp(userData: SignUpInterface): Promise<User | any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;
      if (user && user.uid) {
        await setDoc(doc(this.firestore, 'users', user.uid), {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          createdAt: new Date()
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  ngOnDestroy(): void {
    if (this.unsubContacts) {
      this.unsubContacts();
    }
  }
}