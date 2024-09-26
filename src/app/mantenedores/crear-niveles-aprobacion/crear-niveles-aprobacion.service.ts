import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { convertTimeZonedDate } from "src/app/services/util/dates.util";
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
			data.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
			data.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);

			convertTimeZonedDate(data.fechaCreacion);
			convertTimeZonedDate(data.fechaActualizacion);
		})

		return this.http.post<any>(`${this.apiUrlNivelAprobacion}/post_arreglo`, request);
	}

	public actualizarNivelesAprobacion(request: any[]): Observable<any> {
		request.forEach(data => {
			data.fechaCreacion = new Date(),
				data.fechaActualizacion = new Date();
			data.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
			data.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);

			convertTimeZonedDate(data.fechaCreacion);
			convertTimeZonedDate(data.fechaActualizacion);
		})

		return this.http.post<any>(`${this.apiUrlNivelAprobacion}/put_arreglo`, request);
	}

	public guardarNivelAprobacion(request: any): Observable<any> {
		request.fechaCreacion = new Date(),
			request.fechaActualizacion = new Date();
		request.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.usuarioActualizacion = null;

		return this.http.post<any>(this.apiUrlNivelAprobacion, request);
	}

	public actualizarNivelAprobacion(request: any): Observable<any> {
		request.fechaActualizacion = new Date();
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		return this.http.put<any>(this.apiUrlNivelAprobacion, request);
	}

	public getNivelById(id: number): Observable<any> {
		return this.http.get<any>(`${this.apiUrlNivelAprobacion}/${id}`);
	}

	public getNivelesById(id: string): Observable<any> {
		return this.http.get<any>(`${this.apiUrlNivelAprobacion}/aprobacionesporfiltronivel?IdNivelesAprobacion=${id}`);
	}

	refrescarNivelesAprobaciones(): Observable<any> {
		return this.http.get<any>(`${this.nivelAprobacionRefreshServiceES}`);
	}
}
