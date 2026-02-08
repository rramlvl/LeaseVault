import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../firebase/firebase.config';



@Injectable({
  providedIn: 'root'
})
export class DocSummarizerService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  summarizeFile(file: File, prompt: string): Observable<{ summary: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    const auth = getAuth(firebaseApp);

    return from(
      auth.currentUser?.getIdToken() ?? Promise.reject('Not authenticated')
    ).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        return this.http.post<{ summary: string }>(
          `${this.baseUrl}/summarize-file`,
          formData,
          { headers }
        );
      })
    );
  }
}

