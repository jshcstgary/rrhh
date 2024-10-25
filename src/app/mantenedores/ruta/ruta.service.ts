import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	IRuta,
	IRutas,
} from "./ruta.interface";

@Injectable({
	providedIn: 'root'
})
export class RutaService {
	private apiUrl = environment.rutaServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<IRutas> {
		return this.http.get<IRutas>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: IRuta): Observable<IRuta> {
		request.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaCreacion = new Date();
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaCreacion);
		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.post<IRuta>(this.apiUrl, request);
	}

	public update(request: IRuta): Observable<IRuta> {
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<IRuta>(this.apiUrl, request);
	}
}
