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
}
