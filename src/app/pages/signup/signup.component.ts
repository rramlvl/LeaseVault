import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../firebase/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class SignupComponent implements OnInit {
  loading = false;
  error = '';

  email = '';
  password = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  private getSafeReturnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl') || '/summarize';
    if (!raw.startsWith('/')) return '/summarize';
    return raw;
  }

  private friendlyAuthError(e: any): string {
    const code = e?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email.';
      case 'auth/email-already-in-use':
        return 'An account already exists with that email.';
      case 'auth/weak-password':
        return 'Password is too weak. Try 6+ characters.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      default:
        return e?.message || 'Account creation failed. Please try again.';
    }
  }

  async createAccountEmail() {
    this.error = '';
    try {
      this.loading = true;
      await this.auth.createAccountWithEmail(this.email.trim(), this.password);
      await this.router.navigateByUrl(this.getSafeReturnUrl(), { replaceUrl: true });
    } catch (e: any) {
      this.error = this.friendlyAuthError(e);
    } finally {
      this.loading = false;
    }
  }

  ngOnInit() {
    this.auth.user$
      .pipe(
        filter((u) => u !== undefined),
        filter((u) => !!u),
        take(1)
      )
      .subscribe(() => {
        this.router.navigateByUrl(this.getSafeReturnUrl(), { replaceUrl: true });
      });
  }
}