import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITipoaccion,
  ITipoaccionResponse,
  ITipoacciones,
} from "./tipo-accion.interface";
import { environment } from "src/environments/environment";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class TipoAccionService {
  private apiUrl = environment.tipoAccionServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<ITipoacciones> {
    return this.http.get<ITipoacciones>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: ITipoaccion): Observable<ITipoaccion> {
    request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=null;
    return this.http.post<ITipoaccion>(this.apiUrl, request);
  }
  public update(request: ITipoaccion): Observable<ITipoaccion> {
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=new Date();
    return this.http.put<ITipoaccion>(this.apiUrl, request);
  }
}
