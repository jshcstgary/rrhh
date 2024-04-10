import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import {
  ITiposolicitud,
  ITiposolicitudes,
} from "src/app/mantenedores/tipo_solicitud/tipo-solicitud.interface";
import { ITipoRutaResponse } from "src/app/mantenedores/ruta/ruta.interface";
import { ICatalogoResponse } from "./catalogo.interface";

@Injectable({
  providedIn: "root",
})
export class MantenimientoService {
  private apiSolicitudUrl = environment.tipoSolicitudServiceES;
  private apiTipoRutaUrl = environment.tipoRutaServiceES;
  private apiTipoMotivoUrl = environment.tipoMotivoServiceES;
  private apiTipoAccionUrl = environment.tipoAccionServiceES;
  private apiAccionUrl = environment.accionServiceES;
  private apiRutaUrl = environment.rutaServiceES;
  private apiCatalogoUrl = environment.CatalogoServiceES;
  constructor(private http: HttpClient) {}

  public getTipoSolicitud(): Observable<any[]> {
    return this.http.get<any[]>(this.apiSolicitudUrl);
  }
  public getTipoRuta(): Observable<ITipoRutaResponse> {
    return this.http.get<ITipoRutaResponse>(this.apiTipoRutaUrl);
  }

  public getTipoMotivo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiTipoMotivoUrl);
  }

  public getTipoAccion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiTipoAccionUrl);
  }

  public getAccion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAccionUrl);
  }

  public getRuta(): Observable<any[]> {
    return this.http.get<any[]>(this.apiRutaUrl);
  }

  public getCatalogo(codigo: string): Observable<ICatalogoResponse> {
    return this.http.get<ICatalogoResponse>(`${this.apiCatalogoUrl}/${codigo}`);
  }

  public diagnostic(): Observable<any> {
    return this.http.get<any>(
      "http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND"
    );
  }
}
