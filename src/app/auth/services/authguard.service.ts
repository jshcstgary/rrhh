import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginServices } from "../services/login.services";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class AuthGuardService {
  // private apiUrl: string = environment.permiso;
  private apiUrl: string = "environment.permiso";

  constructor(private http: HttpClient, private loginServices: LoginServices) {}

  getPermissions(User: string, url: string): Observable<any> {
    const headers = this.loginServices.createHeaders();
    if (headers) return null;

    let params = new HttpParams();
    params = params.append("Usuario", User);
    params = params.append("Url", url);

    return this.http.post(this.apiUrl, null, { params, headers: headers });
  }
}