import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITipoproceso,
  ITipoprocesoResponse,
  ITipoSolcitud,
  ITipoprocesos
} from "./tipo-proceso.interface";
import { environment } from "src/environments/environment";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class TipoProcesoService {
  private apiUrl = environment.tipoProcesoServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<ITipoprocesos> {
    return this.http.get<ITipoprocesos>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: ITipoproceso): Observable<ITipoproceso> {
    request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=null;
    return this.http.post<ITipoproceso>(this.apiUrl, request);
  }
  public update(request: ITipoproceso): Observable<ITipoproceso> {
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=new Date();
    return this.http.put<ITipoproceso>(this.apiUrl, request);
  }

}
