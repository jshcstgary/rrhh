import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Session } from "../../interfaces/session.interface";
import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
// import { PermisoService } from "../../../../modules/util/services/permiso.service";
import { Subject, takeUntil } from "rxjs";
// import { UtilService } from "../../../../modules/util/services/util.service";
import { HttpErrorResponse } from "@angular/common/http";
import { StarterService } from "src/app/starter/starter.service";
import Swal from "sweetalert2";
import { LocalStorageKeys } from "src/app/enums/local-storage-keys.enum";
import { LoginServices } from "../../services/login.services";
import { LoginRequest, Perfil } from "src/app/types/permiso.type";
import { appCode, environment } from "src/environments/environment";
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
    }

    this.loginService.login(loginRequest).subscribe({
      next: ({ codigo, nombres, apellidos, email, vistas}: Perfil) => {
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

        this.router.navigate(["/solicitudes/consulta-solicitudes"]);
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

    // this.starterService.getUser(this.user).subscribe({
    //   next: (res) => {
    //     if (res.totalRegistros === 0) {
    //       Swal.fire({
    //         text: "No se encontró el usuario",
    //         icon: "info",
    //         confirmButtonColor: "rgb(227, 199, 22)",
    //         confirmButtonText: "Ok",
    //       });

    //       localStorage.removeItem(LocalStorageKeys.IdUsuario);
    //       localStorage.removeItem(LocalStorageKeys.IdLogin);
    //       localStorage.removeItem(LocalStorageKeys.Permisos);

    //       this.isLoading = false;

    //       return;
    //     }

    //     this.isLoading = false;

    //     localStorage.setItem(LocalStorageKeys.IdUsuario, this.user);
    //     localStorage.setItem(LocalStorageKeys.IdLogin, this.user);
    //     localStorage.setItem(LocalStorageKeys.Permisos, JSON.stringify(
    //       [
    //         {
    //           "codigo": "wf_solicitudes",
    //           "nombre": "Solicitudes",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": false
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_consulta_solicitudes",
    //           "nombre": "Consulta Solicitudes",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "09",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": false
    //             },
    //             {
    //               "codigo_Control": "10",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": false
    //             },
    //             {
    //               "codigo_Control": "11",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "12",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "13",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "14",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_detalle_solicitud",
    //           "nombre": "Detalle Solicitud",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tareas",
    //           "nombre": "Tareas",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": false
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_mis_tareas",
    //           "nombre": "Tareas",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_mantenimiento",
    //           "nombre": "Mantenimiento",
    //           "visualizar": true,
    //           "nuevo": false,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "",
    //               "habilitar": false,
    //               "modificar": false,
    //               "visualizar": false
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_niveles_aprobacion",
    //           "nombre": "Niveles de aprobación",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_crear_niveles_aprobacion",
    //           "nombre": "Crear Niveles de Aprobación",
    //           "visualizar": false,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": false,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "09",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "10",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tipo_solicitudes",
    //           "nombre": "Tipo de Solicitudes",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": false
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tipo_motivo",
    //           "nombre": "Tipo Motivo",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tipo_accion",
    //           "nombre": "Tipo Acción",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tipo_proceso",
    //           "nombre": "Tipo Proceso",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_tipo_ruta",
    //           "nombre": "Tipo Ruta",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_ruta",
    //           "nombre": "Ruta",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_accion",
    //           "nombre": "Acción",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "07",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "08",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_aprobadores_fijos",
    //           "nombre": "Aprobadores Fijos",
    //           "visualizar": true,
    //           "nuevo": true,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": true,
    //           "procesar": false,
    //           "consulta": true,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_crear_aprobador_fijo",
    //           "nombre": "Crear Aprobador Fijo",
    //           "visualizar": false,
    //           "nuevo": true,
    //           "modificar": false,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": false,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             }
    //           ]
    //         },
    //         {
    //           "codigo": "wf_editar_aprobador_fijo",
    //           "nombre": "Editar Aprobador Fijo",
    //           "visualizar": false,
    //           "nuevo": false,
    //           "modificar": true,
    //           "eliminar": false,
    //           "exportar": false,
    //           "procesar": false,
    //           "consulta": false,
    //           "controles": [
    //             {
    //               "codigo_Control": "01",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "02",
    //               "habilitar": true,
    //               "modificar": false,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "03",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "04",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "05",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             },
    //             {
    //               "codigo_Control": "06",
    //               "habilitar": true,
    //               "modificar": true,
    //               "visualizar": true
    //             }
    //           ]
    //         }
    //       ]
    //     ));

    //     this.router.navigate(["/tareas/consulta-tareas"]);
    //   },
    //   error: (err) => {
    //     Swal.fire({
    //       text: "No se encontró registro",
    //       icon: "info",
    //       confirmButtonColor: "rgb(227, 199, 22)",
    //       confirmButtonText: "Sí",
    //     });
    //   }
    // });

    // this.permisosService
    //   .post(this.Session.Usuario)
    //   .pipe(takeUntil(this.unsubscribeService))
    //   .subscribe({
    //     next: (response) => {
    //       this.Session.Programas = response;

    //       localStorage.setItem(
    //         "EjTrSIkX8MUkIQGPRD6mLQwZ5y0gWK5FjV05Aj3bnxDIySz1EW",
    //         JSON.stringify(this.Session)
    //       );

    //       this.router.navigate(["/"]);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.utilService.modalResponse(error.error, "error");
    //     },
    //   });
  }
}
