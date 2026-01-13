import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <header class="topbar">
        <div class="topbar__inner">
        <div class="brand">LeaseVault</div>

        <nav class="nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a routerLink="/summarize" routerLinkActive="active">Summarize</a>
        </nav>

        <div class="auth">
            <a routerLink="/login" routerLinkActive="active">Login</a>
        </div>
        </div>
    </header>

    <main class="container">
        <router-outlet></router-outlet>
    </main>
    `,

})
export class LayoutComponent {}
