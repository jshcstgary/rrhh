import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	ITipoproceso,
	ITipoprocesos
} from "./tipo-proceso.interface";

@Injectable({
	providedIn: 'root'
})
export class TipoProcesoService {
	private apiUrl = environment.tipoProcesoServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<ITipoprocesos> {
		return this.http.get<ITipoprocesos>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: ITipoproceso): Observable<ITipoproceso> {
		request.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = null;

		convertTimeZonedDate(request.fechaCreacion);

		return this.http.post<ITipoproceso>(this.apiUrl, request);
	}

	public update(request: ITipoproceso): Observable<ITipoproceso> {
		request.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<ITipoproceso>(this.apiUrl, request);
	}

}
