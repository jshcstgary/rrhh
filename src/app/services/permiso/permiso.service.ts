import { Injectable } from '@angular/core';
import { Control, Permission } from 'src/app/types/permiso.type';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor() { }

  public getPagePermission(pageCode: string): Control[] {
    const permissions: undefined | Permission[] = JSON.parse(localStorage.getItem("permisos"));

    const permission: undefined | Permission = permissions.find(permission => permission.codigo === pageCode);

    if (permission === undefined) {
      return [];
    }

    return permission.controles;
  }
}
