import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firebaseApp } from './firebase.config';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export type VaultSummary = {
  id?: string;
  fileName: string;
  createdAt: number;     // epoch ms
  summary: string;
};

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private auth: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private async getUid(): Promise<string> {
    const user = await firstValueFrom(
      this.auth.user$.pipe(filter(u => u !== undefined), take(1))
    );
    if (!user) throw new Error('Not signed in');
    return user.uid;
  }

  async saveSummary(fileName: string, summary: string): Promise<string> {
    if (!this.isBrowser) throw new Error('Firestore only runs in browser');

    const uid = await this.getUid();
    const { getFirestore, collection, addDoc } = await import('firebase/firestore');

    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'users', uid, 'summaries');

    const docRef = await addDoc(colRef, {
      fileName,
      summary,
      createdAt: Date.now(),
    });

    return docRef.id;
  }

  async listSummaries(): Promise<VaultSummary[]> {
    if (!this.isBrowser) return [];

    const uid = await this.getUid();
    const { getFirestore, collection, getDocs, orderBy, query } = await import('firebase/firestore');

    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'users', uid, 'summaries');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as VaultSummary[];
  }
}
