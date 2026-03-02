import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { of, race, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { firebaseAuth } from './firebase.config';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (firebaseAuth.currentUser) return true;

  const resolved$ = auth.user$.pipe(
    filter((u) => u !== undefined)
  );

  return resolved$.pipe(
    take(1),
    switchMap((u) => {
      if (u) return of(true);

      return race(
        resolved$.pipe(
          filter((x) => !!x),
          take(1),
          map(() => true)
        ),
        timer(1200).pipe(
          map(() =>
            router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url },
            })
          )
        )
      );
    })
  );
};