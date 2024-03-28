import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  IJAWBiometrico,
  IJAWResponseBiometrico,
  ITrabajadorResponse,
  IMatrizesHabilidadesResponse,
  IMatrizHabilidades,
} from "./jaw.interface";

@Injectable({
  providedIn: "root",
})
export class JAWService {
  private apiUrl = environment.jawUS;

  constructor(private http: HttpClient) {}

  public indexBiometrico(): Observable<IJAWResponseBiometrico> {
    return this.http.get<IJAWResponseBiometrico>(`${this.apiUrl}/biometrico`);
  }
  public deleteBiometrico(idBiometrico: string): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/biometrico/${idBiometrico}`
    );
  }
  public storeBiometrico(
    biometrico: IJAWBiometrico
  ): Observable<IJAWBiometrico> {
    return this.http.post<IJAWBiometrico>(
      `${this.apiUrl}/biometrico`,
      biometrico
    );
  }
  public updateBiometrico(
    biometrico: IJAWBiometrico
  ): Observable<IJAWBiometrico> {
    return this.http.put<IJAWBiometrico>(
      `${this.apiUrl}/biometrico`,
      biometrico
    );
  }

  public getTrabajadores(): Observable<ITrabajadorResponse> {
    return this.http.get<ITrabajadorResponse>(`${this.apiUrl}/trabajador`);
  }

  public getMatrizHabilidades(
    idTrabajador: string
  ): Observable<IMatrizesHabilidadesResponse> {
    return this.http.get<IMatrizesHabilidadesResponse>(
      `${this.apiUrl}/matrizHabilidad/trabajador/${idTrabajador}`
    );
  }

  public getByIdMatrizHabilidades(
    idMatriz: string
  ): Observable<IMatrizesHabilidadesResponse> {
    return this.http.get<IMatrizesHabilidadesResponse>(
      `${this.apiUrl}/matrizHabilidad/${idMatriz}`
    );
  }

  public storeMatrizHabilidades(
    Matriz: IMatrizHabilidades
  ): Observable<IMatrizHabilidades> {
    return this.http.post<IMatrizHabilidades>(
      `${this.apiUrl}/matrizHabilidad`,
      Matriz
    );
  }
  public updateMatrizHabilidades(
    Matriz: IMatrizHabilidades
  ): Observable<IMatrizHabilidades> {
    return this.http.put<IMatrizHabilidades>(
      `${this.apiUrl}/matrizHabilidad`,
      Matriz
    );
  }

  public deleteMatrizHabilidades(idTrabajador: string): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/matrizHabilidad/${idTrabajador}`
    );
  }
}
