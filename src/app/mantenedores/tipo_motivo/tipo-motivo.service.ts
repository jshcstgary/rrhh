import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ITipomotivo,
  ITipomotivoResponse,
  ITipomotivos,
} from "./tipo-motivo.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoMotivoService {
  private apiUrl = environment.tipoMotivoServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<ITipomotivos> {
    return this.http.get<ITipomotivos>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: ITipomotivo): Observable<ITipomotivo> {
    return this.http.post<ITipomotivo>(this.apiUrl, request);
  }
  public update(request: ITipomotivo): Observable<ITipomotivo> {
    return this.http.put<ITipomotivo>(this.apiUrl, request);
  }
}
