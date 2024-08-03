import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { environment } from "src/environments/environment";
import { DetalleAprobaciones } from "src/app/eschemas/DetalleAprobaciones";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RegistrarCandidatoService {
  private apiUrlSeleccionCandidato = environment.seleccionCandidatoServiceES;
  // private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  // private apiEmpleadoEvolutionUrl = environment.empleadoServiceEs;
  // private apiHistoricaCamundaUrl = environment.historicaCamundaServiceEs;
  // private apiDetalleAprobaciones = environment.detalleAprobacionesServiceES;

  public modelSolicitud = new Solicitud();
  public modelDetalleSolicitud = new DetalleSolicitud();
  public modelDetalleAprobaciones = new DetalleAprobaciones();
  constructor(private http: HttpClient) {}

  saveCandidato(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlSeleccionCandidato, request);
  }

  getCandidatoById(idSolictud: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSeleccionCandidato}/${idSolictud}`);
  }

  deleteCandidatoById(idSolictud: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlSeleccionCandidato}/${idSolictud}`);
  }
}
