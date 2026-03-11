import { Injectable } from '@angular/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut as fbSignOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { firebaseAuth } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = firebaseAuth;

  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor() {
    (async () => {
      try {
        await setPersistence(this.auth, browserLocalPersistence);
      } catch (err) {
        console.error('Auth persistence error:', err);
      }

      onAuthStateChanged(this.auth, (user) => this.userSubject.next(user));
    })();
  }

  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  createAccountWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return fbSignOut(this.auth);
  }
}