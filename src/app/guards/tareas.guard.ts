import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermisoService } from '../services/permiso/permiso.service';
import { PageCodes } from '../enums/codes.enum';

export const tareasGuard: CanActivateFn = (route, state) => {
  const permisoService = inject(PermisoService);
  const router = inject(Router);

  const permiso = permisoService.getPagePermission(PageCodes.ConsultaTareas);

  if (permiso.length === 0) {
    return router.createUrlTree(["/solicitudes/consulta-solicitudes"]);
  }
  
  return true;
};
