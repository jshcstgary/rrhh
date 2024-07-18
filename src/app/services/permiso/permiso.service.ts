import { Injectable } from '@angular/core';
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { Control, Permiso } from 'src/app/types/permiso.type';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  constructor() { }

  public getPagePermission(pageCode: string): Control[] {
    const permissions: undefined | Permiso[] = JSON.parse(localStorage.getItem(LocalStorageKeys.Permisos));

    const permission: undefined | Permiso = permissions.find(permission => permission.codigo === pageCode);

    if (permission === undefined) {
      return [];
    }

    return permission.controles;
  }
}
