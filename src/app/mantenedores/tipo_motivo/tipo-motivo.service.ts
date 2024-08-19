import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	ITipomotivo,
	ITipomotivos,
} from "./tipo-motivo.interface";

@Injectable({
	providedIn: 'root'
})
export class TipoMotivoService {
	private apiUrl = environment.tipoMotivoServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<ITipomotivos> {
		return this.http.get<ITipomotivos>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: ITipomotivo): Observable<ITipomotivo> {
		request.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = null;

		convertTimeZonedDate(request.fechaCreacion);

		return this.http.post<ITipomotivo>(this.apiUrl, request);
	}

	public update(request: ITipomotivo): Observable<ITipomotivo> {
		request.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<ITipomotivo>(this.apiUrl, request);
	}
}
