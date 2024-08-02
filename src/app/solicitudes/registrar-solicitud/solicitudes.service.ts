import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { DetalleAprobaciones } from "src/app/eschemas/DetalleAprobaciones";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { environment } from "src/environments/environment";
import {
	IAprobacionesPosicion,
	ITareasResponse,
} from "./registrar-solicitudes.interface";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  private apiUrlSolicitudes = environment.solicitudesServiceES;
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiEmpleadoEvolutionUrl = environment.empleadoServiceEs;
  private apiHistoricaCamundaUrl = environment.historicaCamundaServiceEs;
  private apiDetalleAprobaciones = environment.detalleAprobacionesServiceES;
  private apiUrlTareas = environment.tareasServiceES;
  private apiEmail = environment.senEmailService;
  private engineRestUrl = environment.camundaUrl + "engine-rest/";
  private log(message: string) {}



  public modelSolicitud = new Solicitud();
  public modelDetalleSolicitud = new DetalleSolicitud();
  public modelDetalleAprobaciones = new DetalleAprobaciones();
  constructor(private http: HttpClient) {}

  public getSolicitudes(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes);
  }

  public getSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSolicitudes}/${idSolicitud}`);
  }

  public getDetalleAprobadoresSolicitudesById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(`${this.apiDetalleAprobaciones}/${idSolicitud}`);
  }

  public getDetalleSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlSolicitudes}/detalle-solicitud/${idSolicitud}`
    );
  }

  public getDetalleSolicitud(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes + "/detalle-solicitud");
  }

  cargarDetalleAprobacionesArreglo(detalleAprobaciones: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiDetalleAprobaciones}/post_arreglo`, {
      detalleAprobadorSolicitud: detalleAprobaciones
    });
  }

  obtenerNivelesAprobacionRegistrados(idSolicitud: string): Observable<any> {
    return this.http.get<any>(`${this.apiDetalleAprobaciones}/aprobacionessolicitud/${idSolicitud}`);
  }

  obtenerDetallesAprobacionesSolicitudes(idSolicitud: string, subledgerAprobador: string, usuarioAprobador: string = ""): Observable<any> {
    const headers = new HttpHeaders().set('usuario_aprob', usuarioAprobador);

    return this.http.get<any>(`${this.apiDetalleAprobaciones}/filtrar/${idSolicitud}/${subledgerAprobador}`, {
      headers
    });
  }

  sendEmail(request: any): Observable<any> {
    return this.http.post<any>(this.apiEmail, request);
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
      this.apiDetalleAprobaciones,
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
    idNivelDireccion: any,
    filtro: string
  ): Observable<IAprobacionesPosicion> {
    const headers = new HttpHeaders({
      idNivelDireccion: idNivelDireccion,
    });

    const myObject: any = {
      id_tipo_sol: idTipoSolicitud,
      id_tip_mot: idTipoMotivo,
      cod_pos: codigoPosicion,
      IdNivelDireccion: idNivelDireccion,
      filter: filtro
    };
    const httpParams: HttpParamsOptions = { fromObject: myObject } as HttpParamsOptions;

    return this.http.get<IAprobacionesPosicion>(`${this.apiUrlNivelAprobacion}/aprobacionesporposicion`, {
        params: new HttpParams(httpParams)
      }
    );
  }

  public obtenerTareasPorInstanciaRaiz(
    idDeInstanciaRaiz: string
  ): Observable<ITareasResponse> {
    return this.http.get<ITareasResponse>(
      `${this.apiHistoricaCamundaUrl}/tarea/${idDeInstanciaRaiz}`
    );
  }

  public obtenerComentariosAtencionPorInstanciaRaiz(
    idDeInstanciaRaiz: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiHistoricaCamundaUrl}/variable/${idDeInstanciaRaiz}`
    );
  }

  public getDataNivelesAprobacionPorCodigoPosicion(
    codigoPosicion: any
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiEmpleadoEvolutionUrl}/nivelaprobacion/${codigoPosicion}`
    );
  }

  public getTareaIdParam(idParam: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTareas}/${idParam}`);
  }

  public getTaskId(processInstanceId: String): Observable<any> {
    const endpoint = `${this.engineRestUrl}history/task?rootProcessInstanceId=${processInstanceId}`;

    return this.http.get<any>(endpoint, httpOptions).pipe(
      tap((form) => {
        this.log(`fetched variables`);
        this.log(form);
      }),
      catchError(this.handleError("getVariablesForTask", []))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} fallida: ${error.message}`);
      return of(error as T);
    };
  }
}
