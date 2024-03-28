import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITiposolicitud,
  ITiposolicitudResponse,
  ITiposolicitudes,
} from "./tipo-solicitud.interface";
import { environment } from "src/environments/environment";

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
  public store(request: ITiposolicitud): Observable<ITiposolicitud> {
    return this.http.post<ITiposolicitud>(this.apiUrl, request);
  }
  public update(request: ITiposolicitud): Observable<ITiposolicitud> {
    return this.http.put<ITiposolicitud>(this.apiUrl, request);
  }
}
