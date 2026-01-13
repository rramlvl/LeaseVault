import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../firebase/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <section class="card" style="max-width:520px; margin: 0 auto;">
      <h1 class="h1">Sign in</h1>
      <p class="muted" style="margin-top: 6px;">
        Please sign in with Google to access your LeaseVault.
      </p>

      <div style="margin-top: 14px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn" type="button" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in…' : 'Sign in with Google' }}
        </button>
      </div>

      <p class="muted" style="margin-top: 12px; font-size: 13px;">
        You’ll be redirected back after signing in.
      </p>
    </section>
  `,
})
export class LoginComponent {
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async login() {
    try {
      this.loading = true;
      await this.auth.signInWithGoogle();
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/summarize';
      await this.router.navigateByUrl(returnUrl);
    } finally {
      this.loading = false;
    }
  }
}
