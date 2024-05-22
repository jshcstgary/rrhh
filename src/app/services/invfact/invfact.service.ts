import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { InvFactTableType } from "./invfact.interface";

@Injectable({
  providedIn: "root",
})
export class InvFactService {
  private apiUrl = environment.invFacUS;

  constructor(private http: HttpClient) {}

  public index<T>(table: InvFactTableType): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${table}`);
  }
}
