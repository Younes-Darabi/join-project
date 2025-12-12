import { inject, Injectable, OnDestroy } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, UserCredential, signOut } from '@angular/fire/auth';
import { ContactInterface } from '../../interfaces/contact/contact-list.interface';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnDestroy {
  isLogin = false;
  // currentUser?: ContactInterface;
  // auth: Auth = inject(Auth);
  unsubContacts: any;

  ngOnDestroy(): void {
    if (this.unsubContacts) {
      this.unsubContacts();
    }
  }

  // signup(email: string, password: string) {
  //   const promise = createUserWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential: UserCredential) => {
  //       const user = userCredential.user;
  //       console.log("User signed up successfully:", user.uid);
  //       return userCredential;
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.error("Signup Error:", errorCode, errorMessage);
  //       throw error;
  //     });

  //   return from(promise);
  // }

  // logout() {
  //   return from(signOut(this.auth).then(() => {
  //     this.isLogin = false;
  //     this.currentUser = undefined;
  //     console.log("User signed out.");
  //   }));
  // }

  // async checkEmail(user: ContactInterface): Promise<boolean> {
  //   if (!user.email) return false;
  //   const q = query(
  //     this.getContactsRef(),
  //     where('email', '==', user.email)
  //   );
  //   const snapshot = await getDocs(q);
  //   return !snapshot.empty;
  // }
}