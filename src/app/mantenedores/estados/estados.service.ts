import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { IEstados } from "./estados.interface";

@Injectable({
  providedIn: "root",
})
export class EstadosService {
  private apiCatalogoUrl = environment.CatalogoServiceES;

  constructor(private http: HttpClient) {}

  public index(): Observable<any> {
    return this.http.get<any>(
      `http://10.35.3.162:8065/v1/es/item-catalogo/codigo/RBPEST`
    );
  }

  /*public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }*/

  public store(request: IEstados): Observable<IEstados> {
    return this.http.post<IEstados>(
      `http://10.35.3.162:8065/v1/es/item-catalogo`,
      request
    );
  }

  public update(request: IEstados): Observable<IEstados> {
    return this.http.put<IEstados>(
      `http://10.35.3.162:8065/v1/es/item-catalogo`,
      request
    );
  }
}
