import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    tap({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          router.navigate(['/deploy-list']);
        }
      },
    }),
    map((isLoggedIn) => !isLoggedIn) //only allow acces if not Logged in.
  );
};
