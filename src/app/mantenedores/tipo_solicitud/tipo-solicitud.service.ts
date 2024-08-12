import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITiposolicitud,
  ITiposolicitudResponse,
  ITiposolicitudTable,
  ITiposolicitudes,
} from "./tipo-solicitud.interface";
import { environment } from "src/environments/environment";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudService {

  private apiUrl = environment.tipoSolicitudServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<ITiposolicitudes> {
    return this.http.get<ITiposolicitudes>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: ITiposolicitudTable): Observable<ITiposolicitud> {
    request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=null;
    return this.http.post<ITiposolicitud>(this.apiUrl, request);
  }
  public update(request: ITiposolicitud): Observable<ITiposolicitud> {
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=new Date();
    return this.http.put<ITiposolicitud>(this.apiUrl, request);
  }
}
