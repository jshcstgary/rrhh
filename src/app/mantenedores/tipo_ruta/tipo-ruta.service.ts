import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	ITiporuta,
	ITiporutaResponse,
} from "./tipo-ruta.interface";

@Injectable({
	providedIn: 'root'
})
export class TipoRutaService {
	private apiUrl = environment.tipoRutaServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<ITiporutaResponse> {
		return this.http.get<ITiporutaResponse>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: ITiporuta): Observable<ITiporuta> {
		request.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaCreacion = new Date();
		request.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaCreacion);
		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.post<ITiporuta>(this.apiUrl, request);
	}

	public update(request: ITiporuta): Observable<ITiporuta> {
		request.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<ITiporuta>(this.apiUrl, request);
	}
}
