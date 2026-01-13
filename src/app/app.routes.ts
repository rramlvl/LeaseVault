import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

// ✅ Keep your existing summarizer import — adjust the path to match your project
import { DocSummarizerComponent } from './doc-summarizer/doc-summarizer.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },

      // ✅ Your working feature lives here now
      { path: 'summarize', component: DocSummarizerComponent },

      // Fallback
      { path: '**', redirectTo: '' },
    ],
  },
];