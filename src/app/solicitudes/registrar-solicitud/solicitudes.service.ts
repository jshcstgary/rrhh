import {
  IAprobacionesPosicion,
  ITareasResponse,
} from "./registrar-solicitudes.interface";
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { environment } from "src/environments/environment";
import { IEmpleados } from "../../services/mantenimiento/empleado.interface";
import { DetalleAprobaciones } from "src/app/eschemas/DetalleAprobaciones";

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  private apiUrlSolicitudes = environment.solicitudesServiceES;
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiEmpleadoEvolutionUrl = environment.empleadoServiceEs;
  private apiHistoricaCamundaUrl = environment.historicaCamundaServiceEs;
  private apiDetalleAprobaciones = environment.detalleAprobacionesServiceES;

  public modelSolicitud = new Solicitud();
  public modelDetalleSolicitud = new DetalleSolicitud();
  public modelDetalleAprobaciones = new DetalleAprobaciones();
  constructor(private http: HttpClient) {}

  public getSolicitudes(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes);
  }

  public getSolicitudById(idSolicitud: any): Observable<any> {
    console.log("getSolicitudById call with: ", idSolicitud);
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


  public guardarDetallesAprobacionesSolicitud(request: any): Observable<any> {
    return this.http.post<any>(
      this.apiDetalleAprobaciones + "/post_arreglo",
      request
    );
  }


  /*


  const headers = new HttpHeaders({
      idNivelDireccion: idNivelDireccion,
    });
    console.log("Headers: ", headers);
    return this.http.get<IConsultaNivelesAprobacionResponse>(
      `${this.apiUrlNivelAprobacion}/aprobacionesporfiltro/${idTipoSolicitud}/${idTipoMotivo}`,
      { headers: headers }
    );


  */

    /*
        const queConsulta: string = 'Tecnico/Asistencia';
        const headers = new HttpHeaders().set('IdNivelDireccion', queConsulta);

        const myObject: any = { this: 'thisThing', that: 'thatThing', other: 'otherThing', filter: 'A' };
        const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;

        const options = { params: new HttpParams(httpParams), headers: headers };

        this.httpClient.get<any>('https://server:port/api/endpoint', options)
          .subscribe((data: any) => {
              this.localvar = data;
        });

    */

  public obtenerAprobacionesPorPosicion(
    idTipoSolicitud: any,
    idTipoMotivo: any,
    codigoPosicion: any,
    idNivelDireccion: any
  ): Observable<IAprobacionesPosicion> {
    const headers = new HttpHeaders({
      idNivelDireccion: idNivelDireccion,
    });

    const myObject: any = { filter: 'A' };
    const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;
    console.log(
      "Se llama con esto: " +
        "idTipoSolicitud: " +
        idTipoSolicitud +
        ", idTipoMotivo: " +
        idTipoMotivo +
        ", codigoPosicion: " +
        codigoPosicion +
        ", idNivelDireccion: " +
        idNivelDireccion
    );
    return this.http.get<IAprobacionesPosicion>(
      `${this.apiUrlNivelAprobacion}/aprobacionesporposicion/${idTipoSolicitud}/${idTipoMotivo}/${codigoPosicion}`,
      { params: new HttpParams(httpParams), headers: headers }
    );
  }

  public obtenerTareasPorInstanciaRaiz(
    idDeInstanciaRaiz: string
  ): Observable<ITareasResponse> {
    return this.http.get<ITareasResponse>(
      `${this.apiHistoricaCamundaUrl}/tarea/${idDeInstanciaRaiz}`
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
