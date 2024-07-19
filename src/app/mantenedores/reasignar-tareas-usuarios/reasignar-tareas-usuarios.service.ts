import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaNivelesAprobacionResponse } from "./reasignar-tareas-usuarios.interface";

@Injectable({
  providedIn: "root",
})
export class ConsultaTareasService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiDetallesAprobacionesSolicitud = environment.detalleAprobacionesServiceES;

  private apiUrlTareas = environment.tareasServiceES;

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

  public getTareas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTareas}`);
  }

  public getTareasUsuario(idUsuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTareas}/consultartareasporsubleger/${idUsuario}`);
  }

  public getTareaIdParam(idParam: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTareas}/${idParam}`);
  }
}
