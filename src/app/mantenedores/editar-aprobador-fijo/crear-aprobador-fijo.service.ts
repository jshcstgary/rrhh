import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CrearAprobadorFijoService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private nivelAprobacionRefreshServiceES =
    environment.nivelAprobacionRefreshServiceES;
  constructor(private http: HttpClient) {}

  public guardarNivelAprobacion(request: any): Observable<any> {
  request.fechaCreacion=new Date();
  request.fechaActualizacion=new Date();
  request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
  request.usuarioActualizacion=null;
    return this.http.post<any>(this.apiUrlNivelAprobacion, request);
  }

  public actualizarNivelAprobacion(request: any): Observable<any> {
    request.fechaActualizacion=new Date();
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    return this.http.put<any>(this.apiUrlNivelAprobacion, request);
  }

  public getNivelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlNivelAprobacion}/${id}`);
  }

  refrescarNivelesAprobaciones(): Observable<any> {
    return this.http.get<any>(`${this.nivelAprobacionRefreshServiceES}`);
  }
}
