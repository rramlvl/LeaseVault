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
           By agreeing to use LeaseVault, you acknowledge that the summaries provided are for informational purposes only and do not constitute legal advice. 
         Always consult with a qualified attorney for any legal matters or decisions. 
         AI-generated summaries may not capture all nuances of your lease or rental agreement, and we recommend reviewing the original document carefully.
         AI-generated summaries may contain inaccuracies or omissions. Users should not rely solely on the summaries for making important decisions regarding their leases or rentals.
        </p>
    </div>
      
    </div>
  </section>
`,

})
export class HomeComponent {}
