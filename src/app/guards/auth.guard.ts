import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGuardsService } from '../services/auth-guard/auth-guards.service';
import { PermisoService } from '../services/permiso/permiso.service';
import { PageCodes } from '../enums/codes.enum';

export const authGuardActivate: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authGuardsService = inject(AuthGuardsService);
  const permissionService = inject(PermisoService);

  const isAuthenticated: boolean = authGuardsService.isAuthenticated();

  if (state.url === "/login") {
    return isAuthenticated ? router.createUrlTree(["/solicitudes/consulta-solicitudes"]) : true;
  } else {
    return isAuthenticated ? true : router.createUrlTree(["/login"]);
  }
};
