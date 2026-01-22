import { inject, Injectable, OnDestroy } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { SignUpInterface } from "../../interfaces/sign-up/sign-up.interface";
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { LogInInterface } from "../../interfaces/log-in/log-in.interface";
import { signOut } from 'firebase/auth';

/**
 * Interface representing a user's full name
 * 
 * @author Kevin Hase
 */
export interface FullName {
  /** First name of the user */
  firstName: string;
  
  /** Last name of the user */
  lastName: string;
}

/**
 * Service for handling user authentication
 * Manages Firebase authentication, user registration, login, and logout
 * Tracks current user state and authentication status
 * 
 * @author Kevin Hase
 */
@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnDestroy {
  /** Firestore database instance */
  firestore: Firestore = inject(Firestore);
  
  /** Flag indicating if user is authenticated */
  isAuthenticated: boolean = false;
  
  /** Currently logged in user object */
  currentUser: User | null = null;
  
  /** Unsubscribe function for contacts listener */
  unsubContacts: any;
  
  /** Flag indicating if sign-up process is in progress */
  isSigningUp = false;
  
  /** Flag indicating if authentication state is ready */
  authReady = false;

  /**
   * Creates an instance of AuthService
   * Sets up authentication state listener
   * @param auth - Firebase authentication instance
   */
  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      if (this.isSigningUp) return;

      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.authReady = true;
    });
  }

  /**
   * Checks if user is currently logged in
   * @returns True if user is authenticated
   */
  isLoggedIn(): boolean { return this.isAuthenticated; }

  /**
   * Logs out the current user
   * Clears authentication state and current user
   */
  logout() {
    signOut(this.auth).then(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Retrieves the full name of the current user from Firestore
   * @returns FullName object or null if user not found or not authenticated
   */
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

  /**
   * Signs in a user with email and password
   * @param loginData - Login credentials containing email and password
   * @returns Authenticated user object
   * @throws Authentication error if login fails
   */
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

  /**
   * Registers a new user with email and password
   * Creates user document in Firestore and logs out after creation
   * @param userData - User registration data including name, email, and password
   * @returns Created user object
   */
  async signUp(userData: SignUpInterface): Promise<User> {
    try {
      this.isSigningUp = true;

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;

      await setDoc(doc(this.firestore, 'users', user.uid), {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        createdAt: new Date()
      });

      await signOut(this.auth);

      return user;
    } finally {
      this.isSigningUp = false;
    }
  }

  /**
   * Cleanup on service destruction
   * Unsubscribes from contacts listener if exists
   */
  ngOnDestroy(): void {
    if (this.unsubContacts) {
      this.unsubContacts();
    }
  }
}