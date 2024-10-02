import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CatalogoType, IItemCatalogo, IItemCatalogoTable, IResponseItemCatalogo } from "./catalogo.interface";

@Injectable({
	providedIn: "root",
})
export class CatalogoService {
	private apiUrl = environment.CatalogoServiceES;

	constructor(private http: HttpClient) {}

	public indexItemCatalogo(catalogoType: CatalogoType): Observable<IResponseItemCatalogo> {
		return this.http.get<IResponseItemCatalogo>(`${this.apiUrl}/codigo/${catalogoType}`);
	}

	public indexPaginated(numberPage: number, pageSize: number, catalogoType: CatalogoType): Observable<IResponseItemCatalogo> {
		return this.http.get<IResponseItemCatalogo>(`${this.apiUrl}/${numberPage}/${pageSize}/${catalogoType}`);
	}

	public deleteItemCatalogo(codigo: string): Observable<string> {
		return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
	}

	public storeItemCatalogo(request: IItemCatalogoTable): Observable<IItemCatalogo> {
		return this.http.post<IItemCatalogo>(`${this.apiUrl}`, request);
	}

	public updateItemcatalogo(request: IItemCatalogo): Observable<IItemCatalogo> {
		return this.http.put<IItemCatalogo>(`${this.apiUrl}`, request);
	}
}
