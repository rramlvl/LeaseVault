import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
  <section class="home">
    <div class="card hero">
      <h1 class="title">Welcome to LeaseVault</h1>
      <p class="muted">
        Upload a lease or rental document and get an easy-to-read summary.
      </p>

      <div class="actions">
        <a class="btn btn--accent" routerLink="/summarize">Start a Summary</a>
        <a class="btn btn--secondary" routerLink="/vault">Go to Vault</a>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2 class="h2">Summarize</h2>
        <p class="muted">Upload a document and generate a clear breakdown of key terms.</p>
        <a class="btn btn--secondary" routerLink="/summarize">Open Summarizer</a>
      </div>

      <div class="card">
        <h2 class="h2">Vault</h2>
        <p class="muted">View saved summaries and keep everything in one secure place.</p>
        <a class="btn btn--secondary" routerLink="/vault">Open Vault</a>
      </div>

      <div class="card legal-note">
      <h3>Important Notice</h3>
        <p class="muted">
          LeaseVault provides AI-generated summaries to assist with understanding lease
          documents. These summaries are informational only and may not include every
          legal detail. Users should always review the original document and not rely
          solely on the AI summary for legal decisions.
        </p>
    </div>
      
    </div>
  </section>
`,

})
export class HomeComponent {}
