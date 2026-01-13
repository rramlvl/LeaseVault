import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="topbar__brand">
        <span class="logo">LeaseVault</span>
      </div>

      <nav class="topbar__nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/summarize" routerLinkActive="active">Summarize</a>
        <a routerLink="/login" routerLinkActive="active">Login</a>
      </nav>
    </header>

    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class LayoutComponent {}
