import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConsultaSolicitudesService {
  private apiUrlSolicitudes = environment.solicitudesServiceES;
  constructor(private http: HttpClient) {}

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
