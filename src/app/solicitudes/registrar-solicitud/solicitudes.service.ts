import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetalleSolicitud } from "src/app/eschemas/DetalleSolicitud";
import { Solicitud } from "src/app/eschemas/Solicitud";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  private apiUrlSolicitudes = environment.solicitudesServiceES;
  public modelSolicitud = new Solicitud();
  public modelDetalleSolicitud = new DetalleSolicitud();
  constructor(private http: HttpClient) {}

  public getSolicitudes(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes);
  }

  public getSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSolicitudes}/${idSolicitud}`);
  }

  public getDetalleSolicitudById(idSolicitud: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSolicitudes}/${idSolicitud}`);
  }

  public getDetalleSolicitud(): Observable<any> {
    return this.http.get<any>(this.apiUrlSolicitudes + "/detalle-solicitud");
  }

  public guardarSolicitud(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrlSolicitudes, request);
  }

  public guardarDetalleSolicitud(request: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrlSolicitudes + "/detalle-solicitud",
      request
    );
  }
}
