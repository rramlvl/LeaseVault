import { Component, NgZone } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../firebase/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <header class="topbar">
      <div class="topbar__inner">
        <a class="brand brand-link" routerLink="/">LeaseVault</a>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/summarize" routerLinkActive="active">Summarize</a>
          <a routerLink="/vault" routerLinkActive="active">Vault</a>
        </nav>

        <div class="auth">
          <ng-container *ngIf="(auth.user$ | async) as user">
            <a *ngIf="!user" routerLink="/login">Login</a>

            <button
              *ngIf="user"
              class="btn btn--secondary"
              type="button"
              (click)="logout()"
            >
              Sign out
            </button>
          </ng-container>
        </div>
      </div>
    </header>

    <main class="container container--wide">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class LayoutComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
    private zone: NgZone
  ) {}

  logout() {
    this.auth.signOut().finally(() => {
      this.zone.run(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      });
    });
  }
}
