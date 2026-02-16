import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService, VaultSummary } from '../../firebase/firestore.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
        <div>
          <h1 class="vault-title">Your Vault</h1>
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
        <div class="vault-grid" *ngIf="items.length > 0">
          <a class="vault-tile card"
            *ngFor="let s of items"
            [routerLink]="['/vault', s.id]">

          <div class="tile-top">
            <div class="tile-title">{{ s.fileName }}</div>
            <div class="muted tile-date">{{ formatDate(s.createdAt) }}</div>
          </div>

          <div class="tile-preview muted">
            {{ preview(s.summary) }}
          </div>

          <div class="tile-badge" *ngIf="!s.fileUrl">
            No file saved
          </div>
        </a>
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

  preview(text: string) {
    const t = (text || '').trim();
    return t.length > 160 ? t.slice(0, 160) + '…' : t;
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
