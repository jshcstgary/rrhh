import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrearNivelesAprobacionService {

  private apiUrlNivelAprobacion = environment.nivelAprobacionServiceES;
  constructor(private http: HttpClient) {}

  public guardarNivelAprobacion(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlNivelAprobacion, request);
  }

}
