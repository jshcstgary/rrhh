import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	ITiposolicitud,
	ITiposolicitudTable,
	ITiposolicitudes
} from "./tipo-solicitud.interface";

@Injectable({
	providedIn: 'root'
})
export class TipoSolicitudService {
	private apiUrl = environment.tipoSolicitudServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<ITiposolicitudes> {
		return this.http.get<ITiposolicitudes>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: ITiposolicitudTable): Observable<ITiposolicitud> {
		request.usuarioCreacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaCreacion = new Date();
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaCreacion);
		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.post<ITiposolicitud>(this.apiUrl, request);
	}

	public update(request: ITiposolicitud): Observable<ITiposolicitud> {
		request.usuarioActualizacion = sessionStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<ITiposolicitud>(this.apiUrl, request);
	}
}
