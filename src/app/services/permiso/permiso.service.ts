import { Injectable } from '@angular/core';
import { PageCodes } from 'src/app/enums/codes.enum';
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { Control, Permiso } from 'src/app/types/permiso.type';

@Injectable({
	providedIn: 'root'
})
export class PermisoService {
	constructor() { }

	public getPagePermission(pageCode: string): Control[] {
		const permissions: undefined | Permiso[] = JSON.parse(sessionStorage.getItem(LocalStorageKeys.Permisos));
		const permission: undefined | Permiso = permissions.find(permission => permission.codigo === pageCode);
		const permissionsarray: undefined | Permiso[] = permissions.filter(permission => permission.codigo === pageCode);

		if (permission === undefined) {
			return [];
		}

		if (permissionsarray.length > 1 && pageCode === PageCodes.ConsultaSolicitudes) {
			permissionsarray.forEach((x) => {
				if (x.controles[8].visualizar) {
					permission.controles = x.controles;
				}
			});
		}

		return permission.controles;
	}
}
