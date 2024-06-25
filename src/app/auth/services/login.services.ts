import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginServices {

  constructor(private http: HttpClient) {}

  public isAuthenticated(): void {
    //const currentUser = localStorage.getItem('EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW');
    //if (currentUser) {
    //  const currentUserlocal = this.currentUserValue;
//
    //  if (currentUserlocal != null && currentUserlocal.userName != JSON.parse(currentUser).userName) {
    //    window.location.replace('/welcome');
    //  }
//
    //  if (this.router.url === '/login') {
    //    this.router.navigate(['/welcome']);
    //  }
    //}
    //else {
    //  if (this.router.url != '/login' && this.router.url != '/') {
    //    // Si no está logueado redirige a página de login
    //    this.router.navigate(['/login']);
    //    //window.location.href = '/login';
    //  }
    //}
  }

  createHeaders(): HttpHeaders { //funcion global para el headers
    this.isAuthenticated();
    const currentUser = localStorage.getItem('EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW');
    if (currentUser) {
      const authData = JSON.parse(currentUser);
      const token = authData ? authData.token : '';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Sesion': currentUser,
        'Authorization': `Bearer ${token}`
      });

      console.log("retorna headers"); 
      
      return headers;

    }
    else {
      console.log('No hay un usuario actual');
      return null;
    }
  }

}
