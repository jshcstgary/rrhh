import { HttpClient } from "@angular/common/http";
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

  public obtenerNiveleAprobaciones(): Observable<IConsultaNivelesAprobacionResponse> {
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}`
    );
  }

  // /vl/es/n lesa probacion/{ IdTi poS01i citud}/ {Id TipoMot ivo}/ {IdNive1Di recc ion}
  public filterNivelesAprobaciones(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    idNivelDireccion: any
  ): Observable<IConsultaNivelesAprobacionResponse> {
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}/${idTipoSolicitud}/${idTipoMotivo}/${idNivelDireccion}`
    );
  }
}
