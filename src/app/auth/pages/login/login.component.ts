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
import { LoginRequest, Perfil, PerfilUsuario, PerfilUsuarioResponse } from "src/app/types/permiso.type";
import { appCode, environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { LoginServices } from "../../services/login.services";
import { UtilService } from "src/app/services/util/util.service";
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
  public perfilCodigo: string="";
  public isLoadingPerfil: boolean = false;
  public perfilUsuario: PerfilUsuarioResponse;
  public perfilUsuarioError: PerfilUsuarioResponse = [{
    scg_per_codigo: "",
    scg_per_descripcion: "",
    message: "",
  },{
    scg_per_codigo: "",
    scg_per_descripcion: "",
    message: "",
  },{
    scg_per_codigo: "",
    scg_per_descripcion: "",
    message: "",
  },{
    scg_per_codigo: "",
    scg_per_descripcion: "",
    message: "",
  }];
  private perfilUrl: string = environment.loginES;


  Session: Session;
  private unsubscribeService = new Subject<void>();
  constructor(
    private router: Router,
    private starterService: StarterService,
    private loginService: LoginServices,
    // private permisosService: PermisoService,
		private utilService: UtilService
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

  public getPerfilesUsuario() {
    if (this.user === "") {
      Swal.fire({
        text: "Ingrese el Usuario",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
      });

      return;
    }

    this.isLoading = true;

    const getPerfileRequest: LoginRequest = {
      codigoAplicacion: appCode,
      codigoPerfil: "",
      codigoRecurso: "PWFCAMUMET",
      usuario: this.user,
      password: btoa(this.password),
      isAutenticacionLocal: false,
    };
    this.loginService.getPerfilesUsuario(getPerfileRequest).subscribe({
      next: (response) => {
        this.perfilUsuario=response;
        if (this.perfilUsuario.length === 0) {
          Swal.fire({
            text: "Usuario no encontrado",
            icon: "error",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Ok",
          });

          localStorage.removeItem(LocalStorageKeys.IdLogin);
          localStorage.removeItem(LocalStorageKeys.IdUsuario);
          localStorage.removeItem(LocalStorageKeys.Permisos);
          localStorage.removeItem(LocalStorageKeys.Reloaded);

          this.isLoading = false;
          return;
        }
        this.isLoading = false;
        this.isLoadingPerfil=true;

      },
      error: (err) => {
        if(this.perfilUrl.toUpperCase().includes("IGUANA")){
        this.perfilUsuarioError[0].scg_per_codigo="0001";
        this.perfilUsuarioError[0].scg_per_descripcion="Admin";
        this.perfilUsuarioError[0].message="Exito";

        this.perfilUsuarioError[1].scg_per_codigo="0002";
        this.perfilUsuarioError[1].scg_per_descripcion="Iniciador";
        this.perfilUsuarioError[1].message="Exito";

        this.perfilUsuarioError[2].scg_per_codigo="0003";
        this.perfilUsuarioError[2].scg_per_descripcion="Aprobador";
        this.perfilUsuarioError[2].message="Exito";

        this.perfilUsuarioError[3].scg_per_codigo="0004";
        this.perfilUsuarioError[3].scg_per_descripcion="Aprobador Fijo";
        this.perfilUsuarioError[3].message="Exito";

        this.perfilUsuario=this.perfilUsuarioError;
        this.isLoadingPerfil=true;
       }else{
        Swal.fire({
        text: "Usuario no es valido",
        icon: "error",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
        });
      }
      console.log(this.perfilUsuario);
        console.error(err);

        localStorage.removeItem(LocalStorageKeys.IdLogin);
        localStorage.removeItem(LocalStorageKeys.IdUsuario);
        localStorage.removeItem(LocalStorageKeys.Permisos);
        localStorage.removeItem(LocalStorageKeys.Reloaded);

        this.isLoading = false;

       /* Swal.fire({
          text: "No se pudo obtener el usuario",
          icon: "error",
          confirmButtonColor: "rgb(227, 199, 22)",
          confirmButtonText: "Ok",
        });*/
      }
    });
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
    console.log(this.perfilCodigo);
    if (this.perfilCodigo === null||this.perfilCodigo===undefined||this.perfilCodigo==="") {
      Swal.fire({
        text: "Seleccione un Perfil de Usuario",
        icon: "info",
        confirmButtonColor: "rgb(227, 199, 22)",
        confirmButtonText: "Ok",
      });
      this.isLoading=false;
      return;
    }
    const loginRequest: LoginRequest = {
      codigoAplicacion: appCode,
      codigoPerfil: this.perfilCodigo,
      codigoRecurso: "PWFCAMUMET",
      usuario: this.user,
      password: btoa(this.password),
      isAutenticacionLocal: true,
    };

    this.loginService.login(loginRequest).subscribe({
      next: ({ codigo, nombres, apellidos, email, vistas }: Perfil) => {
        if (vistas.length === 0 || nombres === "" || apellidos === "" || email == "" || codigo === "") {
          Swal.fire({
            text: "Usuario o Contraseña Invalida",
            icon: "error",
            confirmButtonColor: "rgb(227, 199, 22)",
            confirmButtonText: "Ok",
          });

          localStorage.removeItem(LocalStorageKeys.IdLogin);
          localStorage.removeItem(LocalStorageKeys.IdUsuario);
          localStorage.removeItem(LocalStorageKeys.Permisos);
          localStorage.removeItem(LocalStorageKeys.Reloaded);

          this.isLoading = false;

          return;
        }

        localStorage.setItem(LocalStorageKeys.IdLogin, codigo);
        localStorage.setItem(LocalStorageKeys.IdUsuario, email);
        localStorage.setItem(LocalStorageKeys.Permisos, JSON.stringify(vistas));

        this.isLoading = false;

        const isTasksEnabled: boolean = vistas.some(vista => vista.codigo === PageCodes.Tareas);

        this.router.navigate(["/solicitudes/consulta-solicitudes"]);
      },
      error: (err) => {
        console.error(err);

        localStorage.removeItem(LocalStorageKeys.IdLogin);
        localStorage.removeItem(LocalStorageKeys.IdUsuario);
        localStorage.removeItem(LocalStorageKeys.Permisos);
        localStorage.removeItem(LocalStorageKeys.Reloaded);

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
