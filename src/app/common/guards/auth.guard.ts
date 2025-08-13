import { CanActivateFn, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../../common/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () : Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    tap({
      next: isLoggedIn =>{
        if(!isLoggedIn){
          router.navigate(['/login']);
        }
      }
    }),
    map((isLoggedIn) =>isLoggedIn)
  );
};
