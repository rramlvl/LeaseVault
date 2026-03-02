import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import type { FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';

export const firebaseOptions: FirebaseOptions = environment.firebase;

export const firebaseApp: FirebaseApp =
  getApps().length ? getApp() : initializeApp(firebaseOptions);

export const firebaseAuth = getAuth(firebaseApp);
