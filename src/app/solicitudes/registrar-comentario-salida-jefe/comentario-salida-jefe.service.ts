import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioSalidaJefeService {
  private comentarioUrl = environment.comentarioServiceES;

  constructor(private http: HttpClient) { }

  public registrarComentario(comentario: any): Observable<any> {
    return this.http.post<any>(this.comentarioUrl, comentario);
  }

  public obtenerComentarios(id: string): Observable<any> {
    return this.http.get<any>(`${this.comentarioUrl}/${id}`);
  }
}
