import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <section class="card">
      <h1>Sign in</h1>
      <p class="muted">
        Google sign-in will be added next (Firebase Auth).
      </p>

      <div class="actions">
        <button class="btn" type="button" disabled>Sign in with Google</button>
      </div>
    </section>
  `,
})
export class LoginComponent {}
