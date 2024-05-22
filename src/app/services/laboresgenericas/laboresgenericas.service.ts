import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ILaborGenericaResponse } from "./laboresgenericas.interface";

@Injectable({
  providedIn: "root",
})
export class LaborGenericaService {
  private apiUrl = environment.laboresgenericasEs;

  constructor(private http: HttpClient) {}

  public getLaborGenericaByCodProducCodTipoLabor(
    CodProducto: string,
    CodTipoLabor: string
  ): Observable<ILaborGenericaResponse> {
    return this.http.get<ILaborGenericaResponse>(
      `${this.apiUrl}/producto-tipolabor/${CodProducto}/${CodTipoLabor}`
    );
  }
}
