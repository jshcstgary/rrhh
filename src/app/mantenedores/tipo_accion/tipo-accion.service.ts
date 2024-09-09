import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	ITipoaccion,
	ITipoacciones,
} from "./tipo-accion.interface";

@Injectable({
	providedIn: 'root'
})
export class TipoAccionService {
	private apiUrl = environment.tipoAccionServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<ITipoacciones> {
		return this.http.get<ITipoacciones>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: ITipoaccion): Observable<ITipoaccion> {
		request.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaCreacion = new Date();
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaCreacion);
		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.post<ITipoaccion>(this.apiUrl, request);
	}

	public update(request: ITipoaccion): Observable<ITipoaccion> {
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<ITipoaccion>(this.apiUrl, request);
	}
}
