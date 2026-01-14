import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card">
      <h1>Welcome to LeaseVault</h1>
      <p class="muted">
        Upload a lease or rental document and get an easy-to-read summary.
      </p>

      <div class="actions">
        <a class="btn" routerLink="/summarize">Go to Summarizer</a>
        <a class="btn btn--secondary" routerLink="/login">Sign in</a>
      </div>
    </section>
  `,
})
export class HomeComponent {}
