import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../firebase/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
    <header class="topbar">
      <div class="topbar__inner">
        <div class="brand">LeaseVault</div>

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
              style="border-color: rgba(255,255,255,0.25); background: transparent; color: white;"
            >
              Sign out
            </button>
          </ng-container>
        </div>
      </div>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class LayoutComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.signOut();
  }
}
