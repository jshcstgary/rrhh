import { Injectable } from '@angular/core';
import { Control, Permission } from 'src/app/types/permiso.type';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor() { }

  public getPagePermission(pageCode: string): Control[] {
    const permissions: Permission[] = JSON.parse(localStorage.getItem("permisos")!);

    const permission: Permission = permissions.find(permission => permission.codigo === pageCode);

    return permission.controles;
  }
}
