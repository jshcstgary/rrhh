import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  IMaquinaria,
  IMaquinasResponse,
  MaquinariaType,
} from "./maquinaria.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MaquinariaService {
  private apiUrl = environment.maquinariaServiceES;

  constructor(private http: HttpClient) {}
  public indexPaginated(maquinariaType: MaquinariaType): Observable<IMaquinasResponse> {
    return this.http.get<IMaquinasResponse>(
      `${this.apiUrl}/tipo/${maquinariaType}`
    );
  }

  public getById(id: string): Observable<IMaquinaria> {
    return this.http.get<IMaquinaria>(`${this.apiUrl}/${id}`);
  }

  public getByIdHacienda(idhacienda: string, maquinariaType: MaquinariaType): Observable<IMaquinasResponse> {
    return this.http.get<IMaquinasResponse>(`${this.apiUrl}/hacienda-tipo/${idhacienda}/${maquinariaType}`);
  }

  public getBySecuencial(idhacienda: string, maquinariaType: MaquinariaType): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/hacienda-tipo-secuencia/${idhacienda}/${maquinariaType}`);
  }

  public delete(codigo: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${codigo}`);
  }
  public store(request: IMaquinaria): Observable<IMaquinaria> {
    return this.http.post<IMaquinaria>(this.apiUrl, request);
  }
  public update(request: IMaquinaria): Observable<IMaquinaria> {
    return this.http.put<IMaquinaria>(this.apiUrl, request);
  }
}
