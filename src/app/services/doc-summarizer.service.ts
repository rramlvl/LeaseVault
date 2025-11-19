import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    return this.http.post<{ summary: string }>(
      `${this.baseUrl}/summarize-file`,
      formData
    );
  }
}
