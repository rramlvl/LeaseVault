import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    // wait until auth initializes (user !== undefined)
    filter((u) => u !== undefined),
    take(1),
    map((u) => {
      if (u) return true;
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};
