import { Component } from '@angular/core';

@Component({
  selector: 'app-vault',
  standalone: true,
  template: `
    <section class="card">
      <h1 class="h1">Your Vault</h1>
      <p class="muted">Saved summaries will appear here.</p>
    </section>
  `,
})
export class VaultComponent {}
