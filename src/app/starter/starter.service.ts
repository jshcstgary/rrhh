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

  getUser() {
    this.http.get<any>(`${this._apiEmpleadoUrl}/nombre/60063916`).subscribe({
      next: (user) => {
        this.userIniciador = user.evType[0];

        console.log(this.userIniciador);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
