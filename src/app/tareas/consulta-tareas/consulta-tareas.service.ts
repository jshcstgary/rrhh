import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaNivelesAprobacionResponse } from "./consulta-tareas.interface";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ConsultaTareasService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private apiDetallesAprobacionesSolicitud = environment.detalleAprobacionesServiceES;

  private apiUrlTareas = environment.tareasServiceES;
  private engineRestUrl = environment.camundaUrl + "engine-rest/";
  private log(message: string) {}



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
