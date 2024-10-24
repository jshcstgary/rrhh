import { Injectable } from '@angular/core';
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardsService {
	constructor() { }

	public isAuthenticated(): boolean {
		const localStorageValues: (string | undefined | null)[] = [sessionStorage.getItem(LocalStorageKeys.IdUsuario), sessionStorage.getItem(LocalStorageKeys.IdLogin), sessionStorage.getItem(LocalStorageKeys.Permisos)];

		return localStorageValues.every((localStorageValue: string | undefined): boolean => localStorageValue !== undefined && localStorageValue !== null && localStorageValue !== "");
	}
}
