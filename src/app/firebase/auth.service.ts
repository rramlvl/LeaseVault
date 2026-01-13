import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { firebaseApp } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser: boolean;

  // undefined = still initializing
  // null = signed out
  // user object = signed in
  private userSubject = new BehaviorSubject<any | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.init().catch((e) => {
        console.error('Auth init failed:', e);
        this.userSubject.next(null);
      });
    } else {
      this.userSubject.next(null);
    }
  }

  private async init() {
    const { getAuth, onAuthStateChanged } = await import('firebase/auth');

    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      this.userSubject.next(user ?? null);
    });
  }

  async signInWithGoogle(): Promise<void> {
    if (!this.isBrowser) return;

    const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async signOut(): Promise<void> {
    if (!this.isBrowser) return;

    const { getAuth, signOut } = await import('firebase/auth');
    await signOut(getAuth(firebaseApp));
  }
}
