import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirestoreService, VaultSummary } from '../../firebase/firestore.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="home">

    <!-- HERO (single card) -->
    <div class="card hero home-hero">
      <div class="hero-top">
        <div>
          <h1 class="title">Welcome to LeaseVault</h1>
          <p class="muted hero-sub">
            Upload a lease or rental document and get an easy-to-read summary.
          </p>

          <!-- feature highlights (NOT cards) -->
          <div class="hero-features">
            <div class="hero-feature">
              <div class="hero-feature-title">Secure storage</div>
              <div class="muted">Summaries are saved per account with Firebase Authentication.</div>
            </div>

            <div class="hero-feature">
              <div class="hero-feature-title">Fast uploads</div>
              <div class="muted">Upload PDFs up to 10 MB and generate a summary in seconds.</div>
            </div>

            <div class="hero-feature">
              <div class="hero-feature-title">Clear breakdown</div>
              <div class="muted">Quickly find responsibilities, penalties, and key lease terms.</div>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <a class="btn btn--accent" routerLink="/summarize">Start a Summary</a>
          <a class="btn btn--secondary" routerLink="/vault">Open Vault</a>
        </div>
      </div>
    </div>

    <!-- 2-column row: How it works (left) + Recently saved (right) -->
    <div class="home-row-2">
  <!-- LEFT: How it works -->
  <div class="card home-how">
    <h2 class="h2">How LeaseVault Works</h2>

    <div class="how-steps">
      <div class="step">
        <div class="step-num">1</div>
        <div>
          <div class="step-title">Upload your lease</div>
          <div class="muted">PDF only • Max 10 MB</div>
        </div>
      </div>

      <div class="step">
        <div class="step-num">2</div>
        <div>
          <div class="step-title">Generate a summary</div>
          <div class="muted">Get a clear breakdown of key terms.</div>
        </div>
      </div>

      <div class="step">
        <div class="step-num">3</div>
        <div>
          <div class="step-title">Save it to your Vault</div>
          <div class="muted">Pin important leases so they stay at the top.</div>
        </div>
      </div>
    </div>
  </div>

<div class="card home-recent">

  <!-- Header -->
  <div class="home-recent-top">
    <h2 class="h2" style="margin:0;">Recently Saved</h2>
    <a class="muted home-link" routerLink="/vault">View all</a>
  </div>

  <!-- Loading / empty states -->
  <div *ngIf="loading" class="muted" style="margin-top:10px;">Loading…</div>

  <div *ngIf="!loading && error" class="muted" style="margin-top:10px;">
    {{ error }}
  </div>

  <div *ngIf="!loading && !error && !latest" class="muted" style="margin-top:10px;">
    No summaries yet. Generate one on the Summarize page.
  </div>

  <!-- Recent tile -->
  <a
    *ngIf="!loading && latest"
    class="recent-tile"
    [routerLink]="['/vault', latest.id]"
  >
    <div class="recent-title">{{ latest.fileName }}</div>
    <div class="muted recent-date">{{ formatDate(latest.createdAt) }}</div>
    <div class="muted recent-preview">{{ preview(latest.summary) }}</div>
  </a>

</div>
</div>

    <!-- Important Notice (always open) -->
    <div class="card legal-note">
      <h3>Important Notice</h3>
      <p class="muted">
        By agreeing to use LeaseVault, you acknowledge that the summaries provided are for informational purposes only and do not constitute legal advice.
        Always consult with a qualified attorney for any legal matters or decisions.
        AI-generated summaries may not capture all nuances of your lease or rental agreement, and we recommend reviewing the original document carefully.
        AI-generated summaries may contain inaccuracies or omissions. Users should not rely solely on the summaries for making important decisions regarding their leases or rentals.
      </p>
    </div>

  </section>
  `,
})
export class HomeComponent {
  loading = false;
  error: string | null = null;

  totalCount = 0;
  latest: VaultSummary | null = null;

  constructor(private vault: FirestoreService) {
    this.loadHomeData();
  }

  async loadHomeData() {
    try {
      this.loading = true;
      this.error = null;

      const items = await this.vault.listSummaries();
      this.totalCount = items.length;
      this.latest = items.length > 0 ? items[0] : null;
    } catch (e: any) {
      this.error = e?.message ?? 'Failed to load recent summary';
      this.totalCount = 0;
      this.latest = null;
    } finally {
      this.loading = false;
    }
  }

  preview(text: string) {
    const t = (text || '').trim();
    return t.length > 120 ? t.slice(0, 120) + '…' : t;
  }

  formatDate(ms: number) {
    return new Date(ms).toLocaleString();
  }
}