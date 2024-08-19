import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';
import { convertTimeZonedDate } from 'src/app/services/util/dates.util';
import { environment } from "src/environments/environment";
import {
	IAccion,
	IAcciones,
} from "./accion.interface";

@Injectable({
	providedIn: 'root'
})
export class AccionService {
	private apiUrl = environment.accionServiceES;

	constructor(private http: HttpClient) { }

	public index(): Observable<IAcciones> {
		return this.http.get<IAcciones>(`${this.apiUrl}`);
	}

	public delete(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public store(request: IAccion): Observable<IAccion> {
		request.usuarioCreacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = null;

		convertTimeZonedDate(request.fechaCreacion);

		return this.http.post<IAccion>(this.apiUrl, request);
	}

	public update(request: IAccion): Observable<IAccion> {
		request.usuarioActualizacion = localStorage.getItem(LocalStorageKeys.IdLogin);
		request.fechaActualizacion = new Date();

		convertTimeZonedDate(request.fechaActualizacion);

		return this.http.put<IAccion>(this.apiUrl, request);
	}
}
