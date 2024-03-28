import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITiporuta,
  ITiporutaResponse,
  ITiporutas,
} from "./tipo-ruta.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoRutaService {

  private apiUrl = environment.tipoRutaServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<ITiporutaResponse> {
    return this.http.get<ITiporutaResponse>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: ITiporuta): Observable<ITiporuta> {
    return this.http.post<ITiporuta>(this.apiUrl, request);
  }
  public update(request: ITiporuta): Observable<ITiporuta> {
    return this.http.put<ITiporuta>(this.apiUrl, request);
  }
}