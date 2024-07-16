import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuardsService } from '../services/auth-guard/auth-guards.service';

export const authGuardActivate: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authGuardsService = inject(AuthGuardsService);

  const isAuthenticated: boolean = authGuardsService.isAuthenticated();

  if (isAuthenticated) {
    return router.createUrlTree([state.url]);
  } else {
    return router.createUrlTree(["/login"]);
  }
};
