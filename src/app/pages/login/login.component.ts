import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../firebase/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  error = '';

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private getSafeReturnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl') || '/summarize';

    if (!raw.startsWith('/')) return '/summarize';
    return raw;
  }

  async loginGoogle() {
  this.error = '';
  try {
    this.loading = true;
    await this.auth.signInWithGoogle();
    await this.router.navigateByUrl(this.getSafeReturnUrl());
  } catch (e: any) {
    this.error = e?.message || 'Google sign-in failed. Please try again.';
  } finally {
    this.loading = false;
  }
}

  async loginEmail() {
    this.error = '';
    try {
      this.loading = true;
      await this.auth.signInWithEmail(this.email.trim(), this.password);
      await this.router.navigateByUrl(this.getSafeReturnUrl());
    } catch (e: any) {
      this.error = e?.message || 'Email sign-in failed. Please check your info.';
    } finally {
      this.loading = false;
    }
  }

  async createAccountEmail() {
    this.error = '';
    try {
      this.loading = true;
      await this.auth.createAccountWithEmail(this.email.trim(), this.password);
      await this.router.navigateByUrl(this.getSafeReturnUrl());
    } catch (e: any) {
      this.error = e?.message || 'Account creation failed. Try a stronger password.';
    } finally {
      this.loading = false;
    }
  }
}
