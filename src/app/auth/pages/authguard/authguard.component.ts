import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuardService } from '../../services/authguard.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {


    constructor(
        private router: Router,
        private authguard: AuthGuardService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = localStorage.getItem('EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW');
        
        if (currentUser) {
           
            if (state.url === '/') {
                return true;
            }
            else {
                if (state.url === '/login') {
                    this.router.navigate(['/']);
                    return false;
                }
                else {
                    return /*this.getPermissions(JSON.parse(currentUser).Usuario, state.url.substring(1))*/true;
                }
            }
        }
        else {
            if (state.url === '/login') {
                // Si no está logueado y la ruta es /login, permitir acceso a la ruta solicitada
                return true;
            }
            else {
                // Si no está logueado redirige a página de login
                this.router.navigate(['/login']);
                return false;
            }
        }
    }

  getPermissions(usuario: string, url: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
          this.authguard.getPermissions(usuario, url).subscribe(
                (data: any) => {
                    if (data.visualizar) {
                        resolve(true); // Usuario logeado y tiene permisos, se permite acceso a la ruta solicitada
                    }
                    else {
                        this.router.navigate(['/']); // Usuario logeado pero no tiene permisos, redirige a una página de acceso denegado
                        resolve(false);
                    }
                },
                (error) => {
                    console.error('There was an error!', error);
                    reject(error);// Error en la llamada al servicio, se bloquea el acceso
                }
            );
        });
    }
}
