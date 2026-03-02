import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firebaseAuth } from './firebase.config';  // same folder

export const redirectIfAuthedGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const user = firebaseAuth.currentUser;

  if (user) {
    const returnUrl = state.root.queryParams?.['returnUrl'];
    const dest =
      typeof returnUrl === 'string' && returnUrl.startsWith('/')
        ? returnUrl
        : '/';

    return router.createUrlTree([dest]);
  }

  return true;
};