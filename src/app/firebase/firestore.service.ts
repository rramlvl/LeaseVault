import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firebaseApp } from './firebase.config';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set(['application/pdf']);

export type VaultSummary = {
  id?: string;
  fileName: string;
  createdAt: number; // epoch ms
  summary: string;

  fileUrl?: string;
  fileType?: string;

  pinned?: boolean;
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
      this.auth.user$.pipe(filter((u) => u !== undefined), take(1))
    );
    if (!user) throw new Error('Not signed in');
    return user.uid;
  }

  private async uploadToStorage(uid: string, file: File): Promise<string> {
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

    const storage = getStorage(firebaseApp);

    const safeName = file.name.replace(/[^\w.-]/g, '_');
    const path = `users/${uid}/uploads/${Date.now()}_${safeName}`;

    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);

    return getDownloadURL(fileRef);
  }

  async saveSummary(file: File, summary: string): Promise<string> {
  if (!this.isBrowser) throw new Error('Firestore only runs in browser');

  const uid = await this.getUid();
  console.log('[saveSummary] CALLED', { uid, fileName: file?.name, type: file?.type });

  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Only PDF files are allowed.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('File too large. Max size is 10 MB.');
  }

  let fileUrl: string;
  try {
    console.log('[saveSummary] uploading to storage…');
    fileUrl = await this.uploadToStorage(uid, file);
    console.log('[saveSummary] upload OK url=', fileUrl);
  } catch (e) {
    const err = e as any;
    console.error('[saveSummary] STORAGE UPLOAD FAILED:', err?.code, err?.message, err);
    throw err;
  }

  try {
    const { getFirestore, collection, addDoc } = await import('firebase/firestore');
    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'users', uid, 'summaries');

    console.log('[saveSummary] writing firestore doc…');
    const docRef = await addDoc(colRef, {
      fileName: file.name,
      summary,
      createdAt: Date.now(),
      fileUrl,
      fileType: file.type || 'application/octet-stream',
    });

    console.log('[saveSummary] firestore write OK id=', docRef.id);
    return docRef.id;
  } catch (e: any) {
    console.error('[saveSummary] FIRESTORE WRITE FAILED:', e?.code, e?.message, e);
    throw e;
  }
}

  async listSummaries(): Promise<VaultSummary[]> {
    if (!this.isBrowser) return [];

    const uid = await this.getUid();
    const { getFirestore, collection, getDocs, orderBy, query } = await import('firebase/firestore');

    const db = getFirestore(firebaseApp);
    const colRef = collection(db, 'users', uid, 'summaries');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as VaultSummary[];
  }

  async setPinned(id: string, pinned: boolean): Promise<void> {
    if (!this.isBrowser) return;

    const uid = await this.getUid();
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore');

    const db = getFirestore(firebaseApp);
    const docRef = doc(db, 'users', uid, 'summaries', id);

    await updateDoc(docRef, { pinned });
  }

  async getSummary(id: string): Promise<VaultSummary | null> {
    if (!this.isBrowser) return null;

    const uid = await this.getUid();
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');

    const db = getFirestore(firebaseApp);
    const docRef = doc(db, 'users', uid, 'summaries', id);

    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    return { id: snap.id, ...(snap.data() as any) } as VaultSummary;
  }
}
