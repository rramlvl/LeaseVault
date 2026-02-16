import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirestoreService, VaultSummary } from '../../firebase/firestore.service';

@Component({
  selector: 'app-vault-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="card lv-shell">
      <div class="lv-header">
        <div>
          <h1 class="lv-title">Vault Item</h1>
          <p class="lv-subtitle muted" *ngIf="item">{{ item.fileName }}</p>
        </div>

        <a class="btn btn--secondary" routerLink="/vault">Back to Vault</a>
      </div>

      <div *ngIf="loading" class="muted">Loading…</div>
      <div *ngIf="error" class="muted">{{ error }}</div>

      <div class="split" *ngIf="item && !loading">
        <div class="panel">
          <div class="panel-title">Document</div>

          <div class="viewer" *ngIf="item.fileUrl; else noDoc">
            <ng-container *ngIf="isPdf(); else downloadOnly">
              <iframe class="frame" [src]="safeUrl" title="Document viewer"></iframe>
            </ng-container>

            <ng-template #downloadOnly>
              <div style="padding: 14px;">
                <p class="muted" style="margin: 0 0 10px;">
                  Preview is available for PDFs. Download to view this file type.
                </p>
                <a class="btn btn--accent" [href]="item.fileUrl" target="_blank" rel="noopener">
                  Download Document
                </a>
              </div>
            </ng-template>
          </div>

          <ng-template #noDoc>
            <div class="muted">No file was saved for this entry.</div>
          </ng-template>
        </div>

        <div class="panel">
          <div class="panel-title">Summary</div>
          <div class="summary-box">
            <pre class="pre">{{ item.summary }}</pre>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lv-shell { padding: 22px; }
    .lv-header { display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom: 14px; }
    .lv-title { margin:0; color:#fff; font-size: clamp(1.6rem, 2.6vw, 2rem); font-weight: 800; }
    .lv-subtitle { margin:6px 0 0; }

    .split {
      display:grid;
      gap: 14px;
      grid-template-columns: 1fr;
      align-items: start;
    }
    @media (min-width: 900px) {
      .split { grid-template-columns: 1fr 1fr; }
    }

    .panel {
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 14px;
      padding: 16px;
      background: rgba(17, 24, 39, 0.92);
    }
    .panel-title { font-weight: 800; margin-bottom: 12px; color: rgba(255,255,255,0.95); }

    .viewer {
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 14px;
      overflow: hidden;
      background: rgba(2, 6, 23, 0.55);
      height: 70vh;
      min-height: 420px;
    }
    .frame { width:100%; height:100%; border:0; }

    .summary-box {
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 14px;
      padding: 14px;
      background: rgba(2, 6, 23, 0.55);
      height: 70vh;
      min-height: 420px;
      overflow: auto;
    }
    .pre {
      margin:0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255,255,255,0.92);
    }
  `],
})
export class VaultDetailComponent {
  item: VaultSummary | null = null;
  loading = true;
  error = '';
  safeUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private vault: FirestoreService,
    private sanitizer: DomSanitizer
  ) {
    this.load();
  }

  async load() {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) throw new Error('Missing vault item id');

      this.item = await this.vault.getSummary(id);
      if (!this.item) throw new Error('Item not found');

      if (this.item.fileUrl) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.item.fileUrl);
      }
    } catch (e: any) {
      this.error = e?.message || 'Failed to load item';
    } finally {
      this.loading = false;
    }
  }

  isPdf() {
    const t = (this.item?.fileType || '').toLowerCase();
    return t.includes('pdf');
  }
}
