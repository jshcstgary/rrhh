import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NgSelectModule } from "@ng-select/ng-select";
import { Session } from "../../interfaces/session.interface";
// import { PermisoService } from "../../../../modules/util/services/permiso.service";
import { Subject } from "rxjs";
// import { UtilService } from "../../../../modules/util/services/util.service";
import { PageCodes } from "src/app/enums/codes.enum";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { StarterService } from "src/app/starter/starter.service";
import { LoginRequest, Perfil } from "src/app/types/permiso.type";
import { appCode } from "src/environments/environment";
import Swal from "sweetalert2";
import { LoginServices } from "../../services/login.services";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  public user: string = "";
  public password: string = "";

  public isLoading: boolean = false;

  Session: Session;
  private unsubscribeService = new Subject<void>();
  constructor(
    private router: Router,
    private starterService: StarterService,
    private loginService: LoginServices
    // private permisosService: PermisoService,
    // private utilService: UtilService
  ) {
    this.Session = {
      Perfil: "",
      IdEmpresa: "",
      Localidad: "",
      Token: "",
      Usuario: "",
      Perfiles: [],
      // Programas: [],
      Perfile: [],
    };
  }

  ngOnDestroy(): void {
    this.unsubscribeService.next();
    this.unsubscribeService.complete();
  }

  public signIn() {
    if (this.user === "" || this.password === "") {
      Swal.fire({
        text: "Ingrese las credenciales",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
      });

      return;
    }

    this.isLoading = true;

    const loginRequest: LoginRequest = {
      codigoAplicacion: appCode,
      codigoEmpresa: "",
      codigoRecurso: "PWFCAMUMET",
      usuario: this.user
    };

    this.loginService.login(loginRequest).subscribe({
      next: ({ codigo, nombres, apellidos, email, vistas }: Perfil) => {
        if (vistas.length === 0 || nombres === "" || apellidos === "" || email == "" || codigo === "") {
          Swal.fire({
            text: "Usuario no encontrado",
            icon: "error",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Ok",
          });

          localStorage.removeItem(LocalStorageKeys.IdLogin);
          localStorage.removeItem(LocalStorageKeys.IdUsuario);
          localStorage.removeItem(LocalStorageKeys.Permisos);

          this.isLoading = false;

          return;
        }

        localStorage.setItem(LocalStorageKeys.IdLogin, codigo);
        localStorage.setItem(LocalStorageKeys.IdUsuario, email);
        localStorage.setItem(LocalStorageKeys.Permisos, JSON.stringify(vistas));

        this.isLoading = false;

        const isTasksEnabled: boolean = vistas.some(vista => vista.codigo === PageCodes.Tareas);

        if (isTasksEnabled) {
          this.router.navigate(["/tareas/consulta-tareas"]);
        } else {
          this.router.navigate(["/solicitudes/consulta-solicitudes"]);
        }
      },
      error: (err) => {
        console.error(err);

        localStorage.removeItem(LocalStorageKeys.IdLogin);
        localStorage.removeItem(LocalStorageKeys.IdUsuario);
        localStorage.removeItem(LocalStorageKeys.Permisos);

        this.isLoading = false;

        Swal.fire({
          text: "No se pudo obtener el usuario",
          icon: "error",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Ok",
        });
      }
    });
  }
}
