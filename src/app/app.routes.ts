import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { VaultComponent } from './pages/vault/vault.component';

import { DocSummarizerComponent } from './components/doc-summarizer/doc-summarizer.component';
import { authGuard } from './firebase/auth.guard';

export const routes: Routes = [
  // Login is always accessible
  { path: 'login', component: LoginComponent },

  // Everything else requires auth
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      { path: 'summarize', component: DocSummarizerComponent, canActivate: [authGuard] },
      { path: 'vault', component: VaultComponent, canActivate: [authGuard] },
      { path: '**', redirectTo: '' },
    ],
  },
];
