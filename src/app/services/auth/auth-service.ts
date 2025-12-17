import { inject, Injectable, OnDestroy } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { SignUpInterface } from "../../interfaces/sign-up/sign-up.interface";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { LogInInterface } from "../../interfaces/log-in/log-in.interface";
import { signOut } from 'firebase/auth';

export interface FullName {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  isAuthenticated : boolean = false;
  currentUser: User | null = null;
  unsubContacts: any;

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  isLoggedIn(): boolean { return this.isAuthenticated; }





  logout() {
    signOut(this.auth).then(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
    }).catch((error) => {
      console.error(error);
    });
  }

  async getCurrentFullName(): Promise<FullName | null> {
    if (!this.currentUser || !this.currentUser.uid) {
      return null;
    }
    const userUid = this.currentUser.uid;
    try {
      const userDocRef = doc(this.firestore, 'users', userUid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const firstName = userData['firstname'] || '';
        const lastName = userData['lastname'] || '';
        if (firstName || lastName) {
          return {
            firstName: firstName,
            lastName: lastName
          } as FullName;
        } else {
          return { firstName: 'GAST', lastName: '' } as FullName;
        }
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async signIn(loginData: LogInInterface): Promise<User> {
    const { email, password } = loginData;
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      this.isAuthenticated = true;
      return user;
    } catch (error) {
      throw error;
    }
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