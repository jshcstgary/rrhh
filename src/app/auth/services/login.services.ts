import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { LoginRequest, Perfil, PerfilUsuarioResponse } from "src/app/types/permiso.type";
import { environment, pruebasLocales } from "src/environments/environment";

@Injectable({
	providedIn: "root"
})
export class LoginServices {
	private loginUrl: string = environment.loginES;
	// private perfilUrl: string = environment.perfilUsuarioES;

	constructor(private http: HttpClient) {}

	public getPerfilesUsuario(PerfilBody: LoginRequest): Observable<PerfilUsuarioResponse> {
		return this.http.post<PerfilUsuarioResponse>(`${this.loginUrl}/perfil-usuario`, PerfilBody);
	}

	public login(loginBody: LoginRequest): Observable<Perfil> {
		return this.http.post<Perfil>(pruebasLocales ? `${this.loginUrl}/iguana/obtenercredenciales` : `${this.loginUrl}/obtenercredenciales`, loginBody);
	}

	public filtrarCorreo(filtro: any): Observable<Perfil> {
		return this.http.post<Perfil>(`${this.loginUrl}/filtrarcorreo`, filtro);
	}

	public obtenerUsuariosPerfil(filtro: any): Observable<Perfil[]> {
		return this.http.post<Perfil[]>(`${this.loginUrl}/obtenerusuarioperfil`, filtro);
	}

	public empresasSucursales(request: any): Observable<any[]> {
		return this.http.post<any[]>(`${this.loginUrl}/usuariosempresassucursalespuntos`, request);
	}

	public signOut(): Observable<boolean> {
		sessionStorage.removeItem(LocalStorageKeys.IdLogin);
		sessionStorage.removeItem(LocalStorageKeys.IdUsuario);
		sessionStorage.removeItem(LocalStorageKeys.Permisos);
		sessionStorage.removeItem(LocalStorageKeys.Reloaded);
		sessionStorage.removeItem(LocalStorageKeys.Perfiles);
		sessionStorage.removeItem(LocalStorageKeys.Perfil);
		sessionStorage.removeItem(LocalStorageKeys.NombreUsuario);
		sessionStorage.removeItem(LocalStorageKeys.NivelDireccion);
		sessionStorage.removeItem(LocalStorageKeys.CodigoPefil);

		return of(true);
	}

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

	createHeaders(): HttpHeaders {
		//funcion global para el headers
		this.isAuthenticated();
		const currentUser = localStorage.getItem("EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW");
		if (currentUser) {
			const authData = JSON.parse(currentUser);
			const token = authData ? authData.token : "";
			const headers = new HttpHeaders({
				"Content-Type": "application/json",
				Sesion: currentUser,
				Authorization: `Bearer ${token}`
			});

			return headers;
		} else {
			console.log("No hay un usuario actual");
			return null;
		}
	}
}
