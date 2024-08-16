import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IConsultaNivelesAprobacionResponse } from "./niveles-aprobacion.interface";

@Injectable({
	providedIn: "root",
})
export class NivelesAprobacionService {
	private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;

	constructor(private http: HttpClient) { }

	private httpOptions = {
		headers: new HttpHeaders({
			"Content-Type": "application/json",
		}),
	};

	public obtenerNiveleAprobaciones(): Observable<IConsultaNivelesAprobacionResponse> {
		// return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}`);
		return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}`);
	}

	// Con headers
	public filterNivelesAprobaciones(idTipoSolicitud: string, idTipoMotivo: string, idNivelDireccion: string, idTipoRuta: string, idAccion: string): Observable<IConsultaNivelesAprobacionResponse> {
		const fromObject: any = {
			id_tipo_sol: idTipoSolicitud,
			IdNivelDireccion: idNivelDireccion,
			id_tip_mot: idTipoMotivo === "" ? 10000 : idTipoMotivo,
			id_tip_ruta: idTipoRuta === "" ? 10000 : idTipoRuta,
			id_accion: idAccion === "" ? 10000 : idAccion
		};

		const httpParams: HttpParamsOptions = { fromObject } as HttpParamsOptions;

		return this.http.get<IConsultaNivelesAprobacionResponse>(`${this.apiUrlNivelAprobacion}/aprobacionesporfiltro`, {
			params: new HttpParams(httpParams)
		}
		);
	}
}
