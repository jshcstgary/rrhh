import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaAprobadoresFijosResponse } from "./aprobadores-fijos.interface";

@Injectable({
  providedIn: "root",
})
export class AprobadoresFijosService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;

  private apiUrlAprobadoresFijos = environment.aprobadoresFijosServiceES;

  constructor(private http: HttpClient) {}

  public obtenerNiveleAprobaciones(): Observable<IConsultaAprobadoresFijosResponse> {
    return this.http.get<IConsultaAprobadoresFijosResponse>(
      `${this.apiUrlNivelAprobacion}`
    );
  }

  public obtenerAprobadoresFijos(): Observable<IConsultaAprobadoresFijosResponse> {
    return this.http.get<IConsultaAprobadoresFijosResponse>(
      `${this.apiUrlAprobadoresFijos}`
    );
  }

  public obtenerAprobadorFijoById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAprobadoresFijos}/${id}`);
  }

  public actualizarAprobadorFijo(request: any): Observable<any> {
    return this.http.put<any>(this.apiUrlAprobadoresFijos, request);
  }

  public guardarAprobadorFijo(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlAprobadoresFijos, request);
  }

  // /vl/es/n lesa probacion/{ IdTi poS01i citud}/ {Id TipoMot ivo}/ {IdNive1Di recc ion}
  public filterNivelesAprobaciones(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    idNivelDireccion: any
  ): Observable<IConsultaAprobadoresFijosResponse> {
    return this.http.get<IConsultaAprobadoresFijosResponse>(
      `${this.apiUrlNivelAprobacion}/${idTipoSolicitud}/${idTipoMotivo}/${idNivelDireccion}`
    );
  }
}
