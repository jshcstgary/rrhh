import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { PermisoService } from '../services/permiso/permiso.service';

export const routeAccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const permisoService = inject(PermisoService);

  const permisos = permisoService.getPagePermission(route.data["code"]);
  
  return permisos.length > 0 ? true : router.createUrlTree(["/solicitudes/consulta-solicitudes"]);
};
