import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  IAccion,
  IAccionResponse,
  IAcciones,
} from "./accion.interface";
import { environment } from "src/environments/environment";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class AccionService {

  private apiUrl = environment.accionServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<IAcciones> {
    return this.http.get<IAcciones>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: IAccion): Observable<IAccion> {
    request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=null;
    return this.http.post<IAccion>(this.apiUrl, request);
  }
  public update(request: IAccion): Observable<IAccion> {
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=new Date();
    return this.http.put<IAccion>(this.apiUrl, request);
  }
}

