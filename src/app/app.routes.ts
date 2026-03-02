import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { VaultComponent } from './pages/vault/vault.component';
import { VaultDetailComponent } from './pages/vault-detail/vault-detail.component';
import { DocSummarizerComponent } from './components/doc-summarizer/doc-summarizer.component';
import { authGuard } from './firebase/auth.guard';
import { redirectIfAuthedGuard } from './firebase/redirect-if-authed.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [redirectIfAuthedGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [redirectIfAuthedGuard] },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      { path: 'summarize', component: DocSummarizerComponent, canActivate: [authGuard] },
      { path: 'vault', component: VaultComponent, canActivate: [authGuard] },
      { path: 'vault/:id', component: VaultDetailComponent, canActivate: [authGuard] },
      { path: '**', redirectTo: '' },
    ],
  },
];