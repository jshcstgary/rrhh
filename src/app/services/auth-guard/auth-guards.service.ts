import { Injectable } from '@angular/core';
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsService {
  constructor() { }

  public isAuthenticated(): boolean {
    const localStorageValues: (string | undefined)[] = [localStorage.getItem(LocalStorageKeys.IdUsuario), localStorage.getItem(LocalStorageKeys.IdLogin), localStorage.getItem(LocalStorageKeys.Permisos)];

    return localStorageValues.every((localStorageValue: string | undefined): boolean => localStorageValue !== undefined && localStorageValue !== "");
  }
}
