import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class CrearAprobadorFijoService {
	// private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
	// private nivelAprobacionRefreshServiceES = environment.nivelAprobacionRefreshServiceES;
	private apiUrlAprobadoresFijos = environment.aprobadoresFijosServiceES;

	constructor(private http: HttpClient) { }

	public guardarAprobadorFijo(request: any): Observable<any> {
		request.fechA_CREACION = new Date();
		request.usuariO_CREACION = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechA_MODIFICACION = new Date();
		request.usuariO_MODIFICACION = sessionStorage.getItem(LocalStorageKeys.IdLogin);

		convertTimeZonedDate(request.fechA_CREACION);
		convertTimeZonedDate(request.fechA_MODIFICACION);

		return this.http.post<any>(this.apiUrlAprobadoresFijos, request);
	}

	// public guardarNivelAprobacion(request: any): Observable<any> {
	// 	console.log("2");
	// 	request.fechaCreacion = new Date();
	// 	request.fechaActualizacion = new Date();
	// 	request.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
	// 	request.usuarioActualizacion = null;

	// 	return this.http.post<any>(this.apiUrlNivelAprobacion, request);
	// }

	// public actualizarNivelAprobacion(request: any): Observable<any> {
	// 	request.fechA_MODIFICACION = new Date();
	// 	request.usuariO_MODIFICACION = sessionStorage.getItem(LocalStorageKeys.IdLogin);

	// 	convertTimeZonedDate(request.usuariO_MODIFICACION);

	// 	return this.http.put<any>(this.apiUrlNivelAprobacion, request);
	// }

	// public getNivelById(id: number): Observable<any> {
	// 	return this.http.get<any>(`${this.apiUrlNivelAprobacion}/${id}`);
	// }

	// refrescarNivelesAprobaciones(): Observable<any> {
	// 	return this.http.get<any>(`${this.nivelAprobacionRefreshServiceES}`);
	// }
}
