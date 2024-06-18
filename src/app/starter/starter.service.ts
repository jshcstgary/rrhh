import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StarterService {
  private _apiEmpleadoUrl = environment.empleadoServiceEs;

  public userIniciador: any = null;

  constructor(private http: HttpClient) { }

  getUser(idUsuario: string) {
    return this.http.get<any>(`${this._apiEmpleadoUrl}/nombre/${idUsuario}`);
    // this.http.get<any>(`${this._apiEmpleadoUrl}/nombre/${idUsuario}`).subscribe({
    //   next: (user) => {
    //     this.userIniciador = user.evType[0];

    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
  }
}
