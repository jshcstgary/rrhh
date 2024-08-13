import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
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
    // return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}`);
    return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}`);
  }

  // Con headers
  public filterNivelesAprobaciones(idTipoSolicitud: string, idTipoMotivo:string, idNivelDireccion:string, idTipoRuta:string, idTipoAccion:string): Observable<IConsultaNivelesAprobacionResponse> {
    const fromObject: any = {
      id_tipo_sol: idTipoSolicitud,
      id_tip_mot: idTipoMotivo,
      IdNivelDireccion: idNivelDireccion,
      idTipoRuta,
      idTipoAccion
    };

    const httpParams: HttpParamsOptions = { fromObject } as HttpParamsOptions;

    return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}/aprobacionesporfiltro`, {
        params: new HttpParams(httpParams)
      }
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
