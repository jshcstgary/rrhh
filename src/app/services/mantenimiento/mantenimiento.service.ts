import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ITipoRutaResponse } from "src/app/mantenedores/ruta/ruta.interface";
import { environment } from "src/environments/environment";
import { ICatalogoResponse } from "./catalogo.interface";
import { IEmpleados } from "./empleado.interface";
import { INiveles } from "./niveles.interface";

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
  private apiTipoProcesoUrl = environment.tipoProcesoServiceES;
  private apiEmpleadoEvolutionUrl = environment.empleadoServiceEs;
  private apiEmpleadoUrlJaff = environment.exempleadoServiceEsJaff;
  private apiEmpleadoUrlSpyral = environment.exempleadoServiceEsSpyral;
  private apiFamiliaresCandidato = environment.familiaresCandidatoServiceES;
  // http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND
  // http://10.35.3.162:8053/v1/es/item-catalogo/codigo
  private apiCatalogoUrl = environment.CatalogoServiceES;
  constructor(private http: HttpClient) {}

  public getTipoSolicitud(): Observable<any[]> {
    return this.http.get<any[]>(this.apiSolicitudUrl);
  }

  public getTipoProceso(): Observable<any[]> {
    return this.http.get<any[]>(this.apiTipoProcesoUrl);
  }

  public getTipoProcesoPorTipoSolicitud(idTipoSolicitud): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiTipoProcesoUrl}/tiposolicitud/${idTipoSolicitud}`);
  }

  public getTipoRuta(): Observable<ITipoRutaResponse> {
    return this.http.get<ITipoRutaResponse>(this.apiTipoRutaUrl);
  }

  public getTipoMotivo(): Observable<any[]> {
    return this.http.get<any[]>(this.apiTipoMotivoUrl);
  }

  public getTiposMotivosPorTipoSolicitud(
    idTipoSolicitud: number | any
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiTipoMotivoUrl}/tiposolicitud/${idTipoSolicitud}`
    );
  }

  public getTiposAccionesPorTipoSolicitud(
    idTipoSolicitud: number | any
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiTipoAccionUrl}/tiposolicitud/${idTipoSolicitud}`
    );
  }

  public getAccionesPorTipoSolicitud(
    idTipoSolicitud: number | any
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiAccionUrl}/tiposolicitud/${idTipoSolicitud}`
    );
  }

  public getRutasPorTipoRuta(idTipoRuta: number | any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiRutaUrl}/tiporuta/${idTipoRuta}`);
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

  // http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND
  // http://10.35.3.162:8053/v1/es/item-catalogo/codigo
  public getCatalogo(codigo: string): Observable<ICatalogoResponse> {
    return this.http.get<ICatalogoResponse>(
      `${this.apiCatalogoUrl}/codigo/${codigo}`
    );
  }

  public getCatalogoRBPND(): Observable<ICatalogoResponse> {
    return this.http.get<ICatalogoResponse>(
      //"http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND"
      `${this.apiCatalogoUrl}/codigo/RBPND`
    );
  }

  public getCatalogoRBPNA(): Observable<ICatalogoResponse> {
    return this.http.get<ICatalogoResponse>(
      //"http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPNA"
      `${this.apiCatalogoUrl}/codigo/RBPNA`
    );
  }

  public getNiveles(): Observable<INiveles> {
    return this.http.get<INiveles>(
      `${this.apiEmpleadoEvolutionUrl}/niveldireccion`
    );
  }

  public getNivelesPorTipo(tipoNivel: string): Observable<INiveles> {
    return this.http.get<INiveles>(
      `${this.apiEmpleadoEvolutionUrl}/niveldireccion/${tipoNivel}`
    );
  }

  empleadosUrl = {
    ev: this.apiEmpleadoEvolutionUrl,
    jaff: this.apiEmpleadoUrlJaff,
    spyral: this.apiEmpleadoUrlSpyral
  };

  public getDataEmpleadosEvolution(
    type: "jaff" | "ev" | 'spyral' = "ev"
  ): Observable<IEmpleados> {
    return this.http.get<IEmpleados>(this.empleadosUrl[type]);
  }

  public getDataEmpleadosEvolutionPorId(id: string): Observable<IEmpleados> {
    return this.http.get<IEmpleados>(`${this.apiEmpleadoEvolutionUrl}/nombre/${id}`);
  }

  public diagnostic(): Observable<any> {
    return this.http.get<any>(
      //"http://10.35.3.162:8053/v1/es/item-catalogo/codigo/RBPND"
      `${this.apiCatalogoUrl}/codigo/RBPND`
    );
  }

  public getFamiliaresCandidato(): Observable<FamiliaresCandidatosService> {
    return this.http.get<FamiliaresCandidatosService>(
      `${this.apiFamiliaresCandidato}`
    );
  }

  public guardarFamiliaresCandidato(
    data: Partial<FamiliaresCandidatos>
  ): Observable<FamiliaresCandidatos> {
    return this.http.post<FamiliaresCandidatos>(
      `${this.apiFamiliaresCandidato}`,
      data
    );
  }

  public putFamiliaredCandidatos(data: Partial<FamiliaresCandidatos>): Observable<FamiliaresCandidatos>{
    return this.http.put<FamiliaresCandidatos>(
      `${this.apiFamiliaresCandidato}`,
      data
    )
  }
}

interface FamiliaresCandidatosService {
  familiaresCandidato: FamiliaresCandidatos[];
}
export interface FamiliaresCandidatos {
  id?: number;
  idSolicitud: string;
  idSolicitudPadre?: string;
  codigoPosicionPadre?: string;
  codigoPosicion: string;
  nombreEmpleado: string;
  descripcionPosicion?: string;
  subledger?: string;
  cargo?: string;
  unidad?: string;
  codigoPosicionReportaA?: string;
  reportaA?: string;
  departamento?: string;
  localidad?: string;
  parentesco?: string;
  estado?: string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  fechaCreacion: Date | String;
  fechaModificacion: Date | String;
  isEditingRow?: Boolean;
}
