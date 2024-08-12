import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  IRuta,
  IRutaResponse,
  IRutas,
} from "./ruta.interface";
import { environment } from "src/environments/environment";
import { LocalStorageKeys } from 'src/app/enums/local-storage-keys.enum';


@Injectable({
  providedIn: 'root'
})
export class RutaService {

  private apiUrl = environment.rutaServiceES;
  constructor(private http: HttpClient) {}

  public index(): Observable<IRutas> {
    return this.http.get<IRutas>(`${this.apiUrl}`);
  }
  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: IRuta): Observable<IRuta> {
    request.usuarioCreacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=null;
    return this.http.post<IRuta>(this.apiUrl, request);
  }
  public update(request: IRuta): Observable<IRuta> {
    request.usuarioActualizacion=localStorage.getItem(LocalStorageKeys.IdLogin);
    request.fechaActualizacion=new Date();
    return this.http.put<IRuta>(this.apiUrl, request);
  }
}
