import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { environment } from "src/environments/environment";
import { IEmpleados } from "../../services/mantenimiento/empleado.interface";

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  private apiUrlSolicitudes = environment.solicitudesServiceES;
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiEmpleadoEvolutionUrl = environment.empleadoServiceEs;

  public modelSolicitud = new Solicitud();
  public modelDetalleSolicitud = new DetalleSolicitud();
  constructor(private http: HttpClient) {}

  public getSolicitudes(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes);
  }

  public getSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSolicitudes}/${idSolicitud}`);
  }

  public getDetalleSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSolicitudes}/detalle-solicitud/${idSolicitud}`
    );
  }

  public getDetalleSolicitud(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes + "/detalle-solicitud");
  }

  public guardarSolicitud(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlSolicitudes, request);
  }

  public actualizarSolicitud(request: any): Observable<any> {
    return this.http.put<any>(this.apiUrlSolicitudes, request);
  }

  public actualizarDetalleSolicitud(request: any): Observable<any> {
    return this.http.put<any>(
      this.apiUrlSolicitudes + "/detalle-solicitud",
      request
    );
  }

  public guardarDetalleSolicitud(request: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrlSolicitudes + "/detalle-solicitud",
      request
    );
  }

  public getNivelesAprobacion(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    idNivelDireccion: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlNivelAprobacion}/${idTipoSolicitud}/${idTipoMotivo}/${idNivelDireccion}`
    );
  }

  public getDataNivelesAprobacionPorCodigoPosicion(
    codigoPosicion: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiEmpleadoEvolutionUrl}/nivelaprobacion/${codigoPosicion}`
    );
  }
}
