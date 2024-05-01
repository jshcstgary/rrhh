import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaNivelesAprobacionResponse } from "./niveles-aprobacion.interface";

@Injectable({
  providedIn: "root",
})
export class NivelesAprobacionService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  public obtenerNiveleAprobaciones(): Observable<IConsultaNivelesAprobacionResponse> {
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}`
    );
  }

  // Con headers
  public filterNivelesAprobaciones(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    idNivelDireccion: any
  ): Observable<IConsultaNivelesAprobacionResponse> {
    const headers = new HttpHeaders({
      idNivelDireccion: idNivelDireccion,
    });
    console.log("Headers: ", headers);
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}/aprobacionesporfiltro/${idTipoSolicitud}/${idTipoMotivo}`,
      { headers: headers }
    );
  }

  /*

    public filterNivelesAprobaciones(
  idTipoSolicitud: any,
  idTipoMotivo: any,
  idNivelDireccion: any
): Observable<IConsultaNivelesAprobacionResponse> {
  const headers = new HttpHeaders().set('IdNivelDireccion', idNivelDireccion);
  return this.http.get<IConsultaNivelesAprobacionResponse>(
    `${this.apiUrlNivelAprobacion}/${idTipoSolicitud}/${idTipoMotivo}`,
    { headers: headers }
  );
}

  */

  // Sin headers
  /*public filterNivelesAprobaciones(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    idNivelDireccion: any
  ): Observable<IConsultaNivelesAprobacionResponse> {
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}/${idTipoSolicitud}/${idTipoMotivo}/${idNivelDireccion}`
    );
  }*/
}
