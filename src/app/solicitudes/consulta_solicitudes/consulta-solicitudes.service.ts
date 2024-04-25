import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaSolicitudResponse } from "./consulta-solicitudes.interface";

@Injectable({
  providedIn: "root",
})
export class ConsultaSolicitudesService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiUrlSolicitudes = environment.solicitudesServiceES;

  constructor(private http: HttpClient) {}

  public obtenerNiveleAprobaciones(): Observable<IConsultaSolicitudResponse> {
    return this.http.get<IConsultaSolicitudResponse>(
      `${this.apiUrlNivelAprobacion}`
    );
  }

  // /vl/es/n lesa probacion/{ IdTi poS01i citud}/ {Id TipoMot ivo}/ {IdNive1Di recc ion}
  public filterSolicitudes(
    idEmpresa: string,
    idUnidadNegocio: string,
    idTipoSolicitud: string,
    estado: string,
    fechaDesde: any,
    fechaHasta: any
  ): Observable<any> {
    return this.http.get<any>(
      this.apiUrlSolicitudes +
        `/${idEmpresa}/${idUnidadNegocio}/${idTipoSolicitud}/${estado}/${fechaDesde}/${fechaHasta}`
    );
  }
}
