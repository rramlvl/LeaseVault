import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService, VaultSummary } from '../../firebase/firestore.service';

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
        <div>
          <h1 class="h1">Your Vault</h1>
          <p class="muted" style="margin:6px 0 0;">Your saved summaries are stored per account.</p>
        </div>
        <button class="btn btn--secondary" type="button" (click)="load()" [disabled]="loading">
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>

      <div *ngIf="error" class="muted" style="margin-top:12px;">
        {{ error }}
      </div>

      <div *ngIf="!loading && items.length === 0" class="muted" style="margin-top:14px;">
        No saved summaries yet. Generate one on the Summarize page.
      </div>

      <div style="margin-top:14px; display:grid; gap:12px;" *ngIf="items.length > 0">
        <div class="card" style="box-shadow:none;" *ngFor="let s of items">
          <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
            <div style="font-weight:800;">{{ s.fileName }}</div>
            <div class="muted" style="font-size:13px;">{{ formatDate(s.createdAt) }}</div>
          </div>
          <div style="margin-top:10px; border:1px solid var(--border); border-radius:12px; padding:12px; background:#fafbfc;">
            <pre style="margin:0; white-space:pre-wrap; word-break:break-word; font-size:13px; line-height:1.5;">{{ s.summary }}</pre>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class VaultComponent {
  items: VaultSummary[] = [];
  loading = false;
  error: string | null = null;

  constructor(private vault: FirestoreService) {
    this.load();
  }

  async load() {
    try {
      this.loading = true;
      this.error = null;
      this.items = await this.vault.listSummaries();
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to load vault';
      this.items = [];
    } finally {
      this.loading = false;
    }
  }

  formatDate(ms: number) {
    return new Date(ms).toLocaleString();
  }
}
