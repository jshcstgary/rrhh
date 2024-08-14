import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CrearNivelesAprobacionService {
  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  private nivelAprobacionRefreshServiceES =
    environment.nivelAprobacionRefreshServiceES;
  constructor(private http: HttpClient) { }

  public guardarNivelesAprobacion(request: any[]): Observable<any> {
    request.forEach(data => {
      data.fechaCreacion = new Date(),
      data.fechaActualizacion = new Date();
      data.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
      data.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
    })

    console.log(request);
    // return of(true);
    return this.http.post<any>(`${this.apiUrlNivelAprobacion}/post_arreglo`, request);
  }

  public guardarNivelAprobacion(request: any): Observable<any> {
    request.fechaCreacion = new Date(),
    request.fechaActualizacion = new Date();
    request.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
    request.usuarioActualizacion = null;

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

  public getNivelesById(id: string): Observable<any> {
    // return of([
    //   {
    //     "idNivelAprobacion": 166,
    //     "idNivelAprobacionRuta": "GERENCIA MEDIA",
    //     "nivelAprobacionRuta": "GERENCIA MEDIA",
    //     "idTipoSolicitud": 3,
    //     "tipoSolicitud": "Acción de Personal",
    //     "idAccion": 0,
    //     "accion": "",
    //     "idNivelDireccion": "ASISTENTE - TECNICO",
    //     "nivelDireccion": "ASISTENTE - TECNICO",
    //     "idRuta": 1,
    //     "ruta": "1er Nivel de Aprobación",
    //     "idTipoMotivo": 0,
    //     "tipoMotivo": "",
    //     "idTipoRuta": 1,
    //     "tipoRuta": "Áreas Corporativas",
    //     "correo": "",
    //     "fechaActualizacion": "2024-06-18T02:20:07.387",
    //     "fechaCreacion": "2024-06-18T02:20:07.387",
    //     "usuarioCreacion": "",
    //     "usuarioActualizacion": "",
    //     "estado": "A"
    //   },
    //   {
    //     "idNivelAprobacion": 167,
    //     "idNivelAprobacionRuta": "GERENCIA DE UNIDAD O CORPORATIVA",
    //     "nivelAprobacionRuta": "GERENCIA DE UNIDAD O CORPORATIVA",
    //     "idTipoSolicitud": 3,
    //     "tipoSolicitud": "Acción de Personal",
    //     "idAccion": 0,
    //     "accion": "",
    //     "idNivelDireccion": "ASISTENTE - TECNICO",
    //     "nivelDireccion": "ASISTENTE - TECNICO",
    //     "idRuta": 2,
    //     "ruta": "2do Nivel de Aprobación",
    //     "idTipoMotivo": 0,
    //     "tipoMotivo": "",
    //     "idTipoRuta": 1,
    //     "tipoRuta": "Áreas Corporativas",
    //     "correo": "",
    //     "fechaActualizacion": "2024-06-18T02:20:53.137",
    //     "fechaCreacion": "2024-06-18T02:20:53.137",
    //     "usuarioCreacion": "",
    //     "usuarioActualizacion": "",
    //     "estado": "A"
    //   },
    //   {
    //     "idNivelAprobacion": 1165,
    //     "idNivelAprobacionRuta": "Gerente de RRHH Corporativo",
    //     "nivelAprobacionRuta": "Gerente de RRHH Corporativo",
    //     "idTipoSolicitud": 3,
    //     "tipoSolicitud": "Acción de Personal",
    //     "idAccion": 0,
    //     "accion": "",
    //     "idNivelDireccion": "ASISTENTE - TECNICO",
    //     "nivelDireccion": "ASISTENTE - TECNICO",
    //     "idRuta": 9,
    //     "ruta": "RRHH Corporativo",
    //     "idTipoMotivo": 0,
    //     "tipoMotivo": "",
    //     "idTipoRuta": 3,
    //     "tipoRuta": "Aprobadores Fijos",
    //     "correo": "",
    //     "fechaActualizacion": "2024-06-20T14:07:59.627",
    //     "fechaCreacion": "2024-06-20T14:07:59.627",
    //     "usuarioCreacion": "",
    //     "usuarioActualizacion": "",
    //     "estado": "A"
    //   }
    // ]);

    return this.http.get<any>(`${this.apiUrlNivelAprobacion}/aprobacionesporfiltronivel?IdNivelesAprobacion=${id}`);
  }

  refrescarNivelesAprobaciones(): Observable<any> {
    return this.http.get<any>(`${this.nivelAprobacionRefreshServiceES}`);
  }
}
