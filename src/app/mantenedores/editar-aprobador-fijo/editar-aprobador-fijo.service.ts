import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EditarAprobadorFijoService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private nivelAprobacionRefreshServiceES =
    environment.nivelAprobacionRefreshServiceES;
  private apiUrlAprobadoresFijos = environment.aprobadoresFijosServiceES;

  constructor(private http: HttpClient) {}

  public actualizarAprobadorFijo(request: any, id: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrlAprobadoresFijos}`, request);
  }

  public obtenerAprobadorFijoById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlAprobadoresFijos}/${id}`);
  }

  public guardarNivelAprobacion(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlNivelAprobacion, request);
  }

  public actualizarNivelAprobacion(request: any): Observable<any> {
    return this.http.put<any>(this.apiUrlNivelAprobacion, request);
  }

  public getNivelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlNivelAprobacion}/${id}`);
  }

  refrescarNivelesAprobaciones(): Observable<any> {
    return this.http.get<any>(`${this.nivelAprobacionRefreshServiceES}`);
  }
}
